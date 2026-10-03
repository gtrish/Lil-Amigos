import React, { useState, useEffect, useCallback } from 'react';
import './AdminDashboard.css';
import { API } from '../config';

const KEY = 'lilamigos_admin_pw';

const CATEGORIES = [
  { value: 'frocks', label: 'Frocks' },
  { value: 'nightsuits', label: 'Nightsuits' },
  { value: 'co-ord-sets', label: 'Co-ord sets' },
  { value: 'accessories', label: 'Accessories' },
];

const EMPTY = {
  name: '', category: 'frocks', price: '', stock: '',
  imageUrl: '', description: '', sizes: '0-3M,3-6M,6-12M,1-2Y',
};

const AdminDashboard = () => {
  const [password, setPassword] = useState(() => sessionStorage.getItem(KEY) || '');
  const [loggedIn, setLoggedIn] = useState(() => !!sessionStorage.getItem(KEY));
  const [tab, setTab] = useState('products');

  const logout = useCallback(() => {
    sessionStorage.removeItem(KEY);
    setPassword('');
    setLoggedIn(false);
  }, []);

  // Every admin request goes through here so the password is always attached.
  const adminFetch = useCallback(async (path, options = {}) => {
    const res = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Password': sessionStorage.getItem(KEY) || '',
        ...(options.headers || {}),
      },
    });
    if (res.status === 401) {
      logout();
      throw new Error('Your session expired. Please log in again.');
    }
    return res.json();
  }, [logout]);

  if (!loggedIn) {
    return <AdminLogin password={password} setPassword={setPassword} onSuccess={() => setLoggedIn(true)} />;
  }

  return (
    <div className="admin">
      <div className="admin-top">
        <h2>Admin</h2>
        <button className="admin-link" onClick={logout}>Log out</button>
      </div>
      <div className="admin-tabs" role="tablist">
        {['products', 'orders', 'customers'].map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            className={tab === t ? 'active' : ''}
            onClick={() => setTab(t)}
          >
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      {tab === 'products' && <ProductsTab adminFetch={adminFetch} />}
      {tab === 'orders' && <OrdersTab adminFetch={adminFetch} />}
      {tab === 'customers' && <CustomersTab adminFetch={adminFetch} />}
    </div>
  );
};

/* ---------------------------------------------------------------- login */

const AdminLogin = ({ password, setPassword, onSuccess }) => {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.status === 200) {
        sessionStorage.setItem(KEY, password);
        onSuccess();
      } else {
        setError(data.message || 'Could not log in.');
      }
    } catch {
      setError('Cannot reach the server. Check that the backend is running.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin admin-login">
      <h2>Admin login</h2>
      <form onSubmit={submit}>
        <label htmlFor="admin-pw">Password</label>
        <input
          id="admin-pw"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
        {error && <p className="admin-error" role="alert">{error}</p>}
        <button className="admin-primary" disabled={busy || !password}>
          {busy ? 'Checking...' : 'Log in'}
        </button>
      </form>
    </div>
  );
};

/* ------------------------------------------------------------- products */

const ProductsTab = ({ adminFetch }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);      // null = closed, object = open
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/products`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      setError('Cannot reach the server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setForm({ ...EMPTY }); setEditingId(null); setError(''); setMessage(''); };
  const openEdit = (p) => {
    setForm({
      name: p.name, category: p.category, price: p.price, stock: p.stock,
      imageUrl: p.imageUrl, description: p.description || '',
      sizes: Array.isArray(p.sizes) ? p.sizes.join(',') : p.sizes,
    });
    setEditingId(p.id); setError(''); setMessage('');
  };

  const save = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await adminFetch(
        editingId ? `/api/admin/products/${editingId}` : '/api/admin/products',
        { method: editingId ? 'PUT' : 'POST', body: JSON.stringify(form) }
      );
      if (data.status === 200) {
        setMessage(editingId ? 'Changes saved.' : 'Product added.');
        setForm(null); setEditingId(null);
        load();
      } else {
        setError(data.message || 'Could not save the product.');
      }
    } catch (err) { setError(err.message); }
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    setError('');
    try {
      const data = await adminFetch(`/api/admin/products/${p.id}`, { method: 'DELETE' });
      if (data.status === 200) { setMessage('Product deleted.'); load(); }
      else setError(data.message || 'Could not delete the product.');
    } catch (err) { setError(err.message); }
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <section>
      <div className="admin-row">
        <p>{products.length} products in your shop</p>
        {!form && <button className="admin-primary" onClick={openAdd}>Add product</button>}
      </div>
      {message && <p className="admin-ok" role="status">{message}</p>}
      {error && <p className="admin-error" role="alert">{error}</p>}

      {form && (
        <form className="admin-form" onSubmit={save}>
          <h3>{editingId ? 'Edit product' : 'New product'}</h3>
          <label>Name<input value={form.name} onChange={set('name')} required /></label>
          <label>Category
            <select value={form.category} onChange={set('category')}>
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </label>
          <div className="admin-two">
            <label>Price (₹)<input type="number" min="0" step="0.01" value={form.price} onChange={set('price')} required /></label>
            <label>Stock<input type="number" min="0" step="1" value={form.stock} onChange={set('stock')} required /></label>
          </div>
          <label>Image link
            <input type="url" value={form.imageUrl} onChange={set('imageUrl')} placeholder="https://..." required />
          </label>
          {form.imageUrl && <img className="admin-preview" src={form.imageUrl} alt="Product preview" />}
          <label>Description<textarea rows="3" value={form.description} onChange={set('description')} /></label>
          <label>Sizes (separated by commas)<input value={form.sizes} onChange={set('sizes')} /></label>
          <div className="admin-row">
            <button className="admin-primary" type="submit">{editingId ? 'Save changes' : 'Add product'}</button>
            <button type="button" className="admin-link" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </form>
      )}

      {loading ? <p>Loading products...</p> : products.length === 0 ? (
        <p>No products yet. Add your first one.</p>
      ) : (
        <div className="admin-scroll">
          <table className="admin-table">
            <thead><tr><th></th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th></th></tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td><img src={p.imageUrl} alt="" className="admin-thumb" /></td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>₹{Number(p.price).toFixed(2)}</td>
                  <td className={p.stock === 0 ? 'admin-low' : ''}>{p.stock === 0 ? 'Out of stock' : p.stock}</td>
                  <td className="admin-actions">
                    <button className="admin-link" onClick={() => openEdit(p)}>Edit</button>
                    <button className="admin-link admin-danger" onClick={() => remove(p)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

/* --------------------------------------------------------------- orders */

const OrdersTab = ({ adminFetch }) => {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminFetch('/api/admin/orders')
      .then((d) => setOrders(d.orders || []))
      .catch((e) => setError(e.message));
  }, [adminFetch]);

  if (error) return <p className="admin-error" role="alert">{error}</p>;
  if (!orders) return <p>Loading orders...</p>;
  if (orders.length === 0) return <p>No orders yet. They will show up here as customers check out.</p>;

  return (
    <div className="admin-scroll">
      <table className="admin-table">
        <thead><tr><th>Order</th><th>Date</th><th>Customer</th><th>Ship to</th><th>Items</th><th>Total</th></tr></thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>#{o.id}</td>
              <td>{new Date(o.created_at).toLocaleDateString()}</td>
              <td>{o.customer_name}<br />{o.customer_email}</td>
              <td>{o.address}, {o.city} {o.zip}</td>
              <td>
                {(o.items || []).map((i, idx) => (
                  <div key={idx}>{i.name}{i.size ? ` (${i.size})` : ''} × {i.quantity || 1}</div>
                ))}
              </td>
              <td>₹{Number(o.total).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* ----------------------------------------------------------- customers */

const CustomersTab = ({ adminFetch }) => {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminFetch('/api/admin/users')
      .then((d) => setUsers(d.users || []))
      .catch((e) => setError(e.message));
  }, [adminFetch]);

  if (error) return <p className="admin-error" role="alert">{error}</p>;
  if (!users) return <p>Loading customers...</p>;
  if (users.length === 0) return <p>No customers have signed up yet.</p>;

  return (
    <div className="admin-scroll">
      <table className="admin-table">
        <thead><tr><th>ID</th><th>Name</th><th>Email</th></tr></thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}><td>{u.id}</td><td>{u.fullName}</td><td>{u.email}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
