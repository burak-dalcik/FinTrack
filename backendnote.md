# FinTrack Frontend → Backend API Notları

Bu doküman, **bu repodaki React/Vite frontend’in** gerçekten kullandığı HTTP sözleşmesini özetler. .NET 9 (veya başka bir) API’yi bu uygulama ile uyumlu yazarken referans olarak kullanın.

---

## 1. Genel mimari

- Frontend, tek bir host altında **birden fazla “servis kökü”** kullanır (`src/services/apiClient.ts`).
- Örnek tam adres: `{API_HOST}{SERVICE_PATH}{ROUTE}`  
  Örnek: `https://fintrackapi.dalciksoft.com/auth-api/login`

### 1.1 Servis kökleri (path prefix)

| Axios istemcisi | HTTP base path segmenti |
|-----------------|-------------------------|
| `authClient` | `/auth-api` |
| `customerClient` | `/customermanagement-api` |
| `supplierClient` | `/suppliermanagement-api` |
| `invoiceClient` | `/invoicemanagement-api` |
| `paymentClient` | `/paymentmanagement-api` |
| `expenseClient` | `/expensemanagement-api` |
| `productClient` | `/productcatalog-api` |
| `bffClient` | `/bff-service` |

Tek bir ASP.NET Core uygulamasında bu segmentleri `MapGroup` veya `[Route("auth-api")]` ile taklit edebilirsiniz.

### 1.2 Ortam ve adres

- API host’u `src/services/apiClient.ts` içindeki `getApiBase()` ile belirlenir: varsayılan **`https://fintrackapi.dalciksoft.com`**, isteğe bağlı override için proje kökünde `.env` → **`VITE_API_BASE`** (sonunda `/` olmadan).
- `localStorage` anahtarı `fintrack_env` (`preview` | `staging` | `production`) hâlâ yazılabilir; **host seçimi artık buna bağlı değildir** (tek backend adresi).

---

## 2. Her istekte gönderilen başlıklar

Axios interceptor şunları ekler:

| Header | Açıklama |
|--------|----------|
| `Authorization` | `Bearer <JWT>` — token `localStorage` anahtarı `fintrack_auth_token` ile uyumlu olmalıdır (login sonrası kaydedilir). Login isteğinde genelde yoktur. |
| `mbx-business-codename` | İşletme / tenant kodu. Frontend varsayılanı `babil`; `LoginPage` ve `AuthContext` önizlemede `setBusinessCodename` ile ayarlar. |

Backend’de tenant çözümü bu header’a göre yapılacaksa, header adını **değiştirmeyin** veya frontend’i birlikte güncelleyin.

---

## 3. Yanıt gövdesi sözleşmesi

### 3.1 Sarılı / düz JSON

Liste ve detay servisleri şu iki formdan birini kabul edecek şekilde yazılmıştır:

- `response.data` doğrudan kullanılabilir, veya
- `response.data.body` içinde asıl payload olabilir.

Örnek (faturalar listesi): sunucu hem `{ "invoices": [...], "paging": {...} }` hem `{ "body": { "invoices": [...], "paging": {...} } }` tarzını tolere edecek şekilde parse edilir.

### 3.2 Sayfalama (liste endpoint’leri)

Query parametreleri:

- `pageNumber` — sayfa numarası
- `pageRowCount` — sayfa boyutu

Toplam kayıt için frontend sırasıyla şunlara bakar:

- `body.paging.totalRowCount`
- `body.rowCount`
- yoksa listenin uzunluğu

Liste anahtar isimleri servise göre değişir: `invoices`, `invoiceItems` / `invoiceitems`, `payments`, `expenses`, `productOrServices`, `suppliers`, `customers`, vb.

### 3.3 POST/PUT gövde sarma

Çoğu oluşturma/güncelleme isteği gövdeyi şu şekilde gönderir:

```json
{ "data": { ... gerçek DTO ... } }
```

**İstisna:** `POST /v1/users` (kullanıcı davet) düz gövde gönderir: `{ "name", "email", "role" }`.

---

## 4. Kimlik doğrulama (`auth-api`)

### 4.1 Oturum açma

| Özellik | Değer |
|---------|--------|
| Metot | `POST` |
| Path | `/login` |
| Gövde | `{ "username": "<email>", "password": "<şifre>" }` |

Başarılı yanıt (frontend tipi `AuthSession`), en az şu alanları içermelidir:

| Alan | Tip | Açıklama |
|------|-----|----------|
| `sessionId` | string | Oturum kimliği |
| `userId` | string | Kullanıcı kimliği |
| `email` | string | E-posta |
| `accessToken` | string | JWT; `Authorization: Bearer` için kullanılır |
| `fullname` | string? | Gösterim adı |
| `roleId` | string? | Rol eşlemesi için (küçük harfe çevrilerek okunur) |

Frontend rol eşlemesi (`AuthContext` → `mapSessionToUser`):

- `roleId` → `owner` veya `tenantowner` → uygulama rolü **OWNER**
- `roleId` → `accountant` → **ACCOUNTANT**
- diğer → **USER**

### 4.2 Mevcut kullanıcı

| Özellik | Değer |
|---------|--------|
| Metot | `GET` |
| Path | `/currentuser` |
| Auth | `Authorization: Bearer <accessToken>` zorunlu |

Yanıt yine `AuthSession` ile uyumlu olmalıdır.

### 4.3 Login hata kodları (frontend davranışı)

Login başarısız olunca frontend `response.data.errCode` okur:

| `errCode` | Frontend davranışı |
|-----------|---------------------|
| `EmailVerificationNeeded` | `/verify-email` sayfasına yönlendirir (`state.email` ile) |
| `MobileVerificationNeeded` | `/verify-mobile` sayfasına yönlendirir |

İsteğe bağlı: `response.data.message` kullanıcıya gösterilir.

---

## 5. Kullanıcı yönetimi (`auth-api`)

| Metot | Path | Gövde / not |
|-------|------|----------------|
| `GET` | `/v1/users` | Oturumlu kullanıcı listesi. Yanıt: `users` dizisi veya düz dizi. |
| `POST` | `/v1/users` | `{ "name", "email", "role" }` — `role` string: `"OWNER"` \| `"ACCOUNTANT"` \| `"USER"` (`src/types/auth.ts` ile uyumlu). |
| `DELETE` | `/v1/users/{userId}` | Kullanıcıyı pasifleştirme / silme. |

---

## 6. Doğrulama ve şifre sıfırlama (`auth-api`)

Tüm path’ler **auth-api köküne** göredir (ör. `.../auth-api/verification-services/...`).

### 6.1 E-posta doğrulama

| Metot | Path | Gövde |
|-------|------|--------|
| `POST` | `/verification-services/email-verification/start` | `{ "email" }` |
| `POST` | `/verification-services/email-verification/complete` | `{ "email", "secretCode" }` |

### 6.2 Mobil doğrulama

| Metot | Path | Gövde |
|-------|------|--------|
| `POST` | `/verification-services/mobile-verification/start` | `{ "email" }` |
| `POST` | `/verification-services/mobile-verification/complete` | `{ "email", "secretCode" }` |

### 6.3 Şifre sıfırlama (e-posta)

| Metot | Path | Gövde |
|-------|------|--------|
| `POST` | `/verification-services/password-reset-by-email/start` | `{ "email" }` |
| `POST` | `/verification-services/password-reset-by-email/complete` | `{ "email", "secretCode", "password" }` |

### 6.4 Şifre sıfırlama (mobil)

| Metot | Path | Gövde |
|-------|------|--------|
| `POST` | `/verification-services/password-reset-by-mobile/start` | `{ "email" }` |
| `POST` | `/verification-services/password-reset-by-mobile/complete` | `{ "email", "secretCode", "password" }` |

Beklenen yanıt alanları için kaynak: `src/services/verificationService.ts` içindeki TypeScript tür yorumları (`status`, `codeIndex`, `secretCode`, zaman damgaları, `isVerified`, vb.).

---

## 7. Tedarikçiler (`suppliermanagement-api`)

Base: `.../suppliermanagement-api`

| Metot | Path | Query / gövde |
|-------|------|----------------|
| `GET` | `/v1/suppliers` | `pageNumber`, `pageRowCount` |
| `POST` | `/v1/suppliers` | `{ "data": { ... tedarikçi alanları } }` |
| `GET` | `/v1/suppliers/{id}` | — |
| `PUT` | `/v1/suppliers/{id}` | `{ "data": { ... } }` |
| `DELETE` | `/v1/suppliers/{id}` | — |

Tek kayıt yanıtında `supplier` veya liste içinde ilk eleman kullanılabilir.

---

## 8. Müşteriler (`customermanagement-api`)

Base: `.../customermanagement-api`

| Metot | Path | Query / gövde |
|-------|------|----------------|
| `GET` | `/v1/customers` | `pageNumber`, `pageRowCount` |
| `POST` | `/v1/customers` | `{ "data": { ... } }` |

Bu repoda müşteri için `GET /id`, `PUT`, `DELETE` çağrısı yoktur; ihtiyaç halinde eklenebilir.

---

## 9. Faturalar ve kalemler (`invoicemanagement-api`)

Base: `.../invoicemanagement-api`

### 9.1 Faturalar

| Metot | Path | Query / gövde |
|-------|------|----------------|
| `GET` | `/v1/invoices` | `type`, `status`, `customerId`, `supplierId`, `invoiceNumber`, `issueDate`, `issueDateFrom`, `issueDateTo`, `dueDate`, `pageNumber`, `pageRowCount` |
| `GET` | `/v1/invoices/{id}` | — |
| `POST` | `/v1/invoices` | `{ "data": CreateInvoicePayload }` |
| `PUT` | `/v1/invoices/{id}` | `{ "data": UpdateInvoicePayload }` |
| `DELETE` | `/v1/invoices/{id}` | — |

**CreateInvoicePayload** (özet): `type` (`sales` \| `purchase`), `currency`, `customerId?`, `supplierId?`, `issueDate`, `dueDate`, `invoiceNumber`, `notes?`

**Invoice** alanları için: `src/types/invoices.ts` (`status`: `unpaid` \| `partial` \| `paid` \| `overdue`, vb.).

### 9.2 Fatura kalemleri

| Metot | Path | Query / gövde |
|-------|------|----------------|
| `GET` | `/v1/invoiceitems` | `invoiceId`, `pageNumber`, `pageRowCount` |
| `GET` | `/v1/invoiceitems/{id}` | — |
| `POST` | `/v1/invoiceitems` | `{ "data": CreateInvoiceItemPayload }` |
| `PUT` | `/v1/invoiceitems/{id}` | `{ "data": UpdateInvoiceItemPayload }` |
| `DELETE` | `/v1/invoiceitems/{id}` | — |

Kalem oluşturmada: `invoiceId`, `productOrServiceId`, `quantity`, isteğe bağlı `description`, `unitPrice`, `vatRate`.

---

## 10. Ödemeler (`paymentmanagement-api`)

Base: `.../paymentmanagement-api`

| Metot | Path | Query / gövde |
|-------|------|----------------|
| `GET` | `/v1/payments` | `invoiceId`, `method`, `currency`, `reference`, `date`, `pageNumber`, `pageRowCount` |
| `GET` | `/v1/payments/{id}` | — |
| `POST` | `/v1/payments` | `{ "data": CreatePaymentPayload }` |
| `PUT` | `/v1/payments/{id}` | `{ "data": UpdatePaymentPayload }` |
| `DELETE` | `/v1/payments/{id}` | — |

---

## 11. Giderler (`expensemanagement-api`)

Base: `.../expensemanagement-api`

| Metot | Path | Query / gövde |
|-------|------|----------------|
| `GET` | `/v1/expenses` | `category`, `currency`, `supplierId`, `date`, `pageNumber`, `pageRowCount` |
| `GET` | `/v1/expenses/{id}` | — |
| `POST` | `/v1/expenses` | `{ "data": CreateExpensePayload }` |
| `PUT` | `/v1/expenses/{id}` | `{ "data": UpdateExpensePayload }` |
| `DELETE` | `/v1/expenses/{id}` | — |

**Not:** Frontend filtrelerinde `fromDate` / `toDate` vardır; liste isteğinde şu an yalnızca `date` parametresi `fromDate` ile dolduruluyor olabilir (`expenseService.ts`). Aralık filtresi için backend’de `dateFrom`/`dateTo` eklenirse frontend’in de güncellenmesi gerekir.

---

## 12. Ürün ve hizmetler (`productcatalog-api`)

Base: `.../productcatalog-api`

| Metot | Path | Query / gövde |
|-------|------|----------------|
| `GET` | `/v1/productorservices` | `name`, `sku`, `type`, `currency`, `pageNumber`, `pageRowCount` |
| `GET` | `/v1/productorservices/{id}` | — |
| `POST` | `/v1/productorservices` | `{ "data": CreateProductPayload }` |
| `PUT` | `/v1/productorservices/{id}` | `{ "data": UpdateProductPayload }` |
| `DELETE` | `/v1/productorservices/{id}` | — |

---

## 13. Raporlar (`bff-service`)

Base: `.../bff-service`

| Metot | Path | Query |
|-------|------|--------|
| `GET` | `/v1/reports/income-expense` | `fromDate`, `toDate` |

Yanıt: `totalIncome`, `totalExpense` (sayısal; eksikse 0 kabul edilir).

| Metot | Path | Query |
|-------|------|--------|
| `GET` | `/v1/reports/customer-balances` | `fromDate`, `toDate` |
| `GET` | `/v1/reports/supplier-balances` | `fromDate`, `toDate` |

Yanıt: `rows` veya `customers` / `suppliers` dizisi; satırlarda `name`, `balance` benzeri alanlar beklenir (`reportService.ts`).

---

## 14. Geliştirme bayrağı (`SKIP_AUTH`)

`src/config/authMode.ts` içinde `SKIP_AUTH === true` iken frontend gerçek `/login` isteği atmaz; yerel dev kullanıcı ile devam eder. Gerçek API ile test için bu bayrak `false` olmalıdır.

---

## 15. .NET 9 uygulaması için pratik kontrol listesi

1. CORS: Frontend origin (ör. `http://localhost:8103`, üretim domain’i) için `AllowCredentials` gerekmiyorsa bile `WithOrigins(...)` ile izin verin.
2. JWT: `accessToken` süresi, imzalama algoritması ve `Authorization` şeması (`Bearer`) ile uyumlu olsun.
3. Tüm korumalı endpoint’lerde tenant header’ını (`mbx-business-codename`) doğrulama stratejinize göre işleyin veya geçici olarak yok sayın (geliştirme).
4. Hata yanıtları: Login için `errCode` + `message` JSON alanları faydalıdır.
5. Tek API projesinde tüm servis köklerini aynı hostta route group ile eşleştirin; aksi halde frontend’de `apiClient.ts` tek base URL + farklı göreli path’lere refaktör edilmelidir.

---

## 16. Kaynak dosyalar (kod içi doğrulama)

| Konu | Dosya |
|------|--------|
| Base URL ve header’lar | `src/services/apiClient.ts` |
| Login / current user | `src/services/authService.ts` |
| Kullanıcılar | `src/services/userService.ts` |
| Doğrulama | `src/services/verificationService.ts` |
| Ortaklar | `src/services/partnerService.ts` |
| Faturalar | `src/services/invoiceService.ts` |
| Ödemeler | `src/services/paymentService.ts` |
| Giderler | `src/services/expenseService.ts` |
| Ürünler | `src/services/productService.ts` |
| Raporlar | `src/services/reportService.ts` |
| Oturum / rol eşlemesi | `src/context/AuthContext.tsx` |
| Login hata yönlendirme | `src/pages/auth/LoginPage.tsx` |

Bu doküman, frontend sürümüyle birlikte güncellenmelidir; yeni endpoint eklendiğinde ilgili `src/services/*.ts` dosyası da buraya yansıtılmalıdır.
