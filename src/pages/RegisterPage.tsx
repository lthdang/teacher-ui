import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, CheckCircle2, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { registerApi } from '../services/api';

export const RegisterPage: React.FC = () => {
  const [surname, setSurname] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const trimmedSurname = surname.trim();
    const trimmedFirstName = firstName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedSurname) {
      setError('Surname is required.');
      return false;
    }
    if (!trimmedFirstName) {
      setError('First name is required.');
      return false;
    }
    if (!trimmedEmail) {
      setError('Email address is required.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return false;
    }

    if (!password) {
      setError('Password is required.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }

    if (!confirmPassword) {
      setError('Please confirm your password.');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await registerApi({
        email: email.trim(),
        surname: surname.trim(),
        firstName: firstName.trim(),
        password,
      });
      setSuccessMsg('Registration successful');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Registration failed. Please check your connection or details.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="main-content animate-fade-in" style={{ width: '100%' }}>
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '40px 32px',
        }}
      >
        <div style={{ marginBottom: '28px', textAlign: 'center' }}>
          <div
            className="brand-icon"
            style={{ margin: '0 auto 16px', width: '52px', height: '52px' }}
          >
            <UserPlus size={28} color="#FFFFFF" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700 }}>
            Create Account
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>
            Register new administrator credentials
          </p>
        </div>

        {error && (
          <div className="alert alert-danger" id="register-error-alert">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="alert alert-success" id="register-success-alert">
            <CheckCircle2 size={20} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-surname">Surname</label>
              <input
                id="reg-surname"
                type="text"
                className="form-input"
                placeholder="e.g. Le"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-firstname">First Name</label>
              <input
                id="reg-firstname"
                type="text"
                className="form-input"
                placeholder="e.g. Dang"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                id="reg-email"
                type="email"
                className="form-input"
                style={{ paddingLeft: '44px' }}
                placeholder="newadmin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                style={{ paddingLeft: '44px', paddingRight: '44px' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px',
                }}
                id="toggle-reg-password-btn"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-confirm-password">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                id="reg-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                className="form-input"
                style={{ paddingLeft: '44px', paddingRight: '44px' }}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px',
                }}
                id="toggle-reg-confirm-password-btn"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            style={{ marginTop: '24px' }}
            disabled={isSubmitting}
            id="register-submit-btn"
          >
            <UserPlus size={20} />
            <span>{isSubmitting ? 'Registering...' : 'Register'}</span>
          </button>
        </form>

        <div style={{ marginTop: '28px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>
            Sign In
          </Link>
        </div>

        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <Link to="/" style={{ color: 'var(--text-dark)', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={14} /> Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};
