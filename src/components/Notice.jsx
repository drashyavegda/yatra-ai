import { Info, AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react';

const ICONS = { info: Info, warn: AlertTriangle, error: XCircle, success: CheckCircle2 };

export default function Notice({ kind = 'info', children, actions }) {
  const Icon = ICONS[kind] || Info;
  return (
    <div className={`notice notice-${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
      <Icon size={18} aria-hidden="true" />
      <div style={{ flex: 1 }}>
        <div>{children}</div>
        {actions ? <div className="notice-actions">{actions}</div> : null}
      </div>
    </div>
  );
}
