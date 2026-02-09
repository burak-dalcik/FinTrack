import { FormEvent, useEffect, useState } from "react";
import { DataTable } from "../../components/ui/DataTable";
import { Modal } from "../../components/ui/Modal";
import { userService } from "../../services/userService";
import { Role, User } from "../../types/auth";

export const UserManagementPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<{ name: string; email: string; role: Role }>({
    name: "",
    email: "",
    role: Role.User
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await userService.list();
      setUsers(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setSaving(true);
    try {
      await userService.invite(form);
      setOpen(false);
      setForm({ name: "", email: "", role: Role.User });
      await load();
    } finally {
      setSaving(false);
    }
  };

  const deactivate = async (userId: string) => {
    await userService.deactivate(userId);
    await load();
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">User Management</h2>
        <button className="btn btn-primary" onClick={() => setOpen(true)}>
          Invite User
        </button>
      </div>

      {loading ? (
        <div className="centered">
          <div className="spinner" />
        </div>
      ) : (
        <DataTable<User>
          columns={[
            { header: "Name", accessor: "name" },
            { header: "Email", accessor: "email" },
            { header: "Role", accessor: "role" },
            {
              header: "Actions",
              accessor: (u) => (
                <div className="table-actions">
                  <button className="btn btn-secondary" onClick={() => deactivate(u.id)}>
                    Deactivate
                  </button>
                </div>
              )
            }
          ]}
          data={users}
          getRowKey={(u) => u.id}
          emptyMessage="No users yet."
        />
      )}

      <Modal title="Invite User" open={open} onClose={() => setOpen(false)}>
        <form className="form" onSubmit={submit}>
          <label className="form-label">
            Name
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </label>
          <label className="form-label">
            Email
            <input
              type="email"
              className="input"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
            />
          </label>
          <label className="form-label">
            Role
            <select
              className="select"
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as Role }))}
            >
              <option value={Role.Owner}>Owner</option>
              <option value={Role.Accountant}>Accountant</option>
              <option value={Role.User}>User</option>
            </select>
          </label>
          <button
            className="btn btn-primary"
            type="submit"
            disabled={!form.name || !form.email || saving}
          >
            {saving ? "Inviting..." : "Invite User"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

