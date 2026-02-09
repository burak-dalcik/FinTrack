import axios from "axios";
import { authClient } from "./apiClient";

const getBase = () => (authClient.defaults.baseURL as string) ?? "";

export const verificationService = {
  // Email verification after registration/login
  async startEmailVerification(email: string) {
    const res = await axios.post(`${getBase()}/verification-services/email-verification/start`, {
      email
    });
    return res.data as {
      status: string;
      codeIndex: number;
      secretCode?: string;
      userId?: string;
      timeStamp: number;
      expireTime: number;
      date: string;
    };
  },

  async completeEmailVerification(email: string, secretCode: string) {
    const res = await axios.post(
      `${getBase()}/verification-services/email-verification/complete`,
      {
        email,
        secretCode
      }
    );
    return res.data as {
      status: string;
      isVerified: boolean;
      email: string;
      userId?: string;
      mobileVerificationNeeded?: boolean;
    };
  },

  // Mobile verification
  async startMobileVerification(email: string) {
    const res = await axios.post(`${getBase()}/verification-services/mobile-verification/start`, {
      email
    });
    return res.data as {
      status: string;
      codeIndex: number;
      secretCode?: string;
      userId?: string;
      timeStamp: number;
      expireTime: number;
      date: string;
    };
  },

  async completeMobileVerification(email: string, secretCode: string) {
    const res = await axios.post(
      `${getBase()}/verification-services/mobile-verification/complete`,
      {
        email,
        secretCode
      }
    );
    return res.data as {
      status: string;
      isVerified: boolean;
      mobile: string;
      userId?: string;
    };
  },

  // Password reset by email
  async startPasswordResetByEmail(email: string) {
    const res = await axios.post(
      `${getBase()}/verification-services/password-reset-by-email/start`,
      { email }
    );
    return res.data as {
      userId: string;
      email: string;
      codeIndex: number;
      secretCode?: string;
      timeStamp: number;
      expireTime: number;
      date: string;
    };
  },

  async completePasswordResetByEmail(email: string, secretCode: string, password: string) {
    const res = await axios.post(
      `${getBase()}/verification-services/password-reset-by-email/complete`,
      {
        email,
        secretCode,
        password
      }
    );
    return res.data as {
      userId: string;
      email: string;
      isVerified: boolean;
    };
  },

  // Password reset by mobile
  async startPasswordResetByMobile(email: string) {
    const res = await axios.post(
      `${getBase()}/verification-services/password-reset-by-mobile/start`,
      { email }
    );
    return res.data as {
      status: string;
      codeIndex: number;
      mobile: string;
      secretCode?: string;
      timeStamp: number;
      expireTime: number;
      date: string;
    };
  },

  async completePasswordResetByMobile(email: string, secretCode: string, password: string) {
    const res = await axios.post(
      `${getBase()}/verification-services/password-reset-by-mobile/complete`,
      {
        email,
        secretCode,
        password
      }
    );
    return res.data as {
      userId: string;
      isVerified: boolean;
    };
  }
};

