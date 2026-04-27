import { Link } from "react-router-dom";
import { Plus, Pencil } from "lucide-react";
import { mockTemplates } from "../mock/data";

export default function Templates() {
  return (
    <div className="page-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">Templates</h1>
          <p className="page-subtitle">
            Reusable email layouts — edit blocks once, use them across every campaign.
          </p>
        </div>
        <div className="page-actions">
          <Link to="/templates/new" className="btn btn-primary">
            <Plus size={14} />
            New Template
          </Link>
        </div>
      </div>

      <div className="template-grid">
        {mockTemplates.map((t) => (
          <div key={t.id} className="template-card">
            <div className="template-thumb" style={{ background: t.color + "15" }}>
              <div className="mock">
                <div className="bar" style={{ background: t.color, width: "55%" }} />
                <div className="bar" />
                <div className="bar" style={{ width: "80%" }} />
                <div className="bar" style={{ width: "70%" }} />
                <div className="btn-mock" style={{ background: t.color }} />
              </div>
            </div>
            <div className="template-meta">
              <div>
                <div className="name">{t.name}</div>
                <div className="mod">Modified {new Date(t.lastModified).toLocaleDateString()}</div>
              </div>
              <Link to={`/templates/${t.id}/edit`} className="btn btn-icon" title="Edit">
                <Pencil size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
