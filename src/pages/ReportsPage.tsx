import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Clock,
  CheckCircle,
  FileCheck2,
  FileSpreadsheet,
  Printer,
  Sparkles,
} from 'lucide-react';
import { Breadcrumbs, StatusChip } from '../components/ui';
import { useToastStore } from '../store';
import type { Report } from '../data/types';

const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000);

const seededReports: Report[] = [
  {
    id: 'RPT-BEL-2026-091',
    type: 'Daily Traffic Density Summary',
    dateRange: '27 Sep 2026 – 28 Sep 2026',
    generatedAt: hoursAgo(2),
    generatedBy: 'Priya Sharma (Traffic Analyst)',
    status: 'completed',
    fileSize: '3.4 MB',
  },
  {
    id: 'RPT-BEL-2026-090',
    type: 'Single Plate Trajectory Dossier (GJ05CD5678)',
    dateRange: '28 Sep 2026 (12 sightings)',
    generatedAt: hoursAgo(5),
    generatedBy: 'Amit Patel (Enforcement Officer)',
    status: 'completed',
    fileSize: '1.8 MB',
  },
  {
    id: 'RPT-BEL-2026-089',
    type: 'National Blacklist Intercept Incident Log',
    dateRange: 'Past 7 Days (State Tri-City Grid)',
    generatedAt: hoursAgo(18),
    generatedBy: 'Rajesh Kumar Singh (Admin)',
    status: 'completed',
    fileSize: '4.2 MB',
  },
  {
    id: 'RPT-BEL-2026-088',
    type: 'Peak Hour Congestion & Bottleneck Analysis',
    dateRange: 'SG Highway & CG Road Corridor',
    generatedAt: hoursAgo(28),
    generatedBy: 'Priya Sharma (Traffic Analyst)',
    status: 'completed',
    fileSize: '5.1 MB',
  },
  {
    id: 'RPT-BEL-2026-087',
    type: 'OCR Precision & Camera Node Audit Report',
    dateRange: 'Past 30 Days (50 Nodes)',
    generatedAt: hoursAgo(48),
    generatedBy: 'Sunita Desai (Auditor)',
    status: 'completed',
    fileSize: '6.7 MB',
  },
];

export const ReportsPage: React.FC = () => {
  const { addToast } = useToastStore();

  const [reportType, setReportType] = useState('Daily Traffic Density Summary');
  const [dateRangeOption, setDateRangeOption] = useState('today');
  const [specificPlate, setSpecificPlate] = useState('GJ05CD5678');
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedReady, setGeneratedReady] = useState<Report | null>(null);
  const [reportList, setReportList] = useState<Report[]>(seededReports);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setProgress(10);
    setGeneratedReady(null);

    const timer = setInterval(() => {
      setProgress((curr) => {
        if (curr >= 100) {
          clearInterval(timer);
          setGenerating(false);

          const newReport: Report = {
            id: `RPT-BEL-2026-${String(Math.floor(100 + Math.random() * 900))}`,
            type: reportType === 'Single Plate Trajectory Dossier' ? `${reportType} (${specificPlate})` : reportType,
            dateRange: dateRangeOption === 'today' ? 'Today (28 Sep 2026)' : 'Past 7 Days Aggregated',
            generatedAt: new Date(),
            generatedBy: 'Duty Officer (Current Session)',
            status: 'completed',
            fileSize: '2.9 MB',
          };

          setGeneratedReady(newReport);
          setReportList([newReport, ...reportList]);

          addToast({
            type: 'success',
            title: 'Report Compiled',
            message: `Official government analysis dossier generated: ${newReport.id}`,
          });

          return 100;
        }
        return curr + 22;
      });
    }, 350);
  };

  const handleDownload = (rpt: Report) => {
    addToast({
      type: 'success',
      title: 'Downloading Dossier',
      message: `File ${rpt.id}.pdf encrypted with digital watermark downloaded`,
    });
  };

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Intelligence Reports' }]} />

      {/* Header */}
      <div className="bg-white border border-[#DDE3EA] rounded-md shadow-sm p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-[#1F3A6E] tracking-tight flex items-center gap-2">
            <FileText size={18} />
            Statutory Traffic & ANPR Intelligence Reporting
          </h1>
          <p className="text-xs text-gray-500">
            Generate cryptographically signed compliance reports for traffic enforcement and urban planning
          </p>
        </div>
      </div>

      {/* Generator Form */}
      <div className="bg-white border border-[#DDE3EA] rounded-md shadow-sm p-5">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-3 flex items-center gap-1.5">
          <Sparkles size={14} className="text-[#E8891A]" />
          Compile New Traffic Intelligence Document
        </h3>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Report Template Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full border border-[#DDE3EA] bg-white rounded px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#1F3A6E]"
              >
                <option value="Daily Traffic Density Summary">Daily Traffic Density Summary</option>
                <option value="Single Plate Trajectory Dossier">Single Plate Trajectory Dossier</option>
                <option value="Alert Log">Alert & Intercept Incident Log</option>
                <option value="Congestion Analysis">Corridor Congestion & Speed Analysis</option>
                <option value="OCR Accuracy Audit">Neural OCR Sensor Hardware Audit</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Time Interval
              </label>
              <select
                value={dateRangeOption}
                onChange={(e) => setDateRangeOption(e.target.value)}
                className="w-full border border-[#DDE3EA] bg-white rounded px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#1F3A6E]"
              >
                <option value="today">Today (Past 24 Hours)</option>
                <option value="week">Past 7 Days (Consolidated)</option>
                <option value="month">Current Month (September 2026)</option>
                <option value="custom">Custom RTO Surveillance Range</option>
              </select>
            </div>

            {reportType === 'Single Plate Trajectory Dossier' ? (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Target Vehicle Registration
                </label>
                <input
                  type="text"
                  value={specificPlate}
                  onChange={(e) => setSpecificPlate(e.target.value.toUpperCase())}
                  placeholder="e.g. GJ05CD5678"
                  className="w-full border border-[#DDE3EA] rounded px-3 py-1.5 text-xs font-mono font-bold uppercase focus:outline-none focus:border-[#1F3A6E]"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Jurisdiction Scope
                </label>
                <select className="w-full border border-[#DDE3EA] bg-white rounded px-3 py-2 text-xs text-gray-800">
                  <option>Tri-City Unified Region (Ahmedabad, Gandhinagar, Anand)</option>
                  <option>Ahmedabad Municipal Corporation (AMC)</option>
                  <option>Gandhinagar Smart Capital Sector</option>
                  <option>Anand Highway Corridor</option>
                </select>
              </div>
            )}
          </div>

          {/* Progress bar during generation */}
          {generating && (
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs text-gray-600 font-medium">
                <span>Querying ANPR trajectory databases & computing O-D matrices...</span>
                <span className="font-mono font-bold text-[#1F3A6E]">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#1F3A6E] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Success banner after generate */}
          {generatedReady && (
            <div className="bg-green-50 border border-green-200 rounded p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-[#2E7D32]" />
                <div>
                  <p className="text-xs font-bold text-green-900">{generatedReady.id} Ready</p>
                  <p className="text-[11px] text-green-700">
                    {generatedReady.type} · {generatedReady.fileSize} · Digitally signed by BEL
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDownload(generatedReady)}
                className="px-3 py-1.5 text-xs bg-[#2E7D32] hover:bg-green-800 text-white rounded font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Download size={13} /> Download PDF Dossier
              </button>
            </div>
          )}

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={generating}
              className="px-5 py-2 text-xs bg-[#1F3A6E] hover:bg-[#162B52] text-white rounded font-semibold transition-colors shadow-xs disabled:opacity-50"
            >
              {generating ? 'Processing Dossier...' : 'Generate Official Report'}
            </button>
          </div>
        </form>
      </div>

      {/* Recently Generated Reports Table */}
      <div className="bg-white border border-[#DDE3EA] rounded-md shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#DDE3EA] flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide">
            Recently Compiled Statutory Reports
          </h3>
          <span className="text-xs text-gray-500 font-medium">Digital Archive (5 Records)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-[#F4F6F9] text-gray-600 font-bold uppercase tracking-wider border-b border-[#DDE3EA]">
              <tr>
                <th className="p-3 text-left">Report Reference</th>
                <th className="p-3 text-left">Document Title</th>
                <th className="p-3 text-left">Surveillance Window</th>
                <th className="p-3 text-left">Generated By</th>
                <th className="p-3 text-left">Timestamp</th>
                <th className="p-3 text-left">Size</th>
                <th className="p-3 text-right">Download</th>
              </tr>
            </thead>
            <tbody>
              {reportList.map((rpt, idx) => (
                <tr
                  key={rpt.id}
                  className={`border-b border-[#DDE3EA]/70 hover:bg-blue-50/40 transition-colors ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-[#F4F6F9]/30'
                  }`}
                >
                  <td className="p-3 font-mono font-bold text-[#1F3A6E]">{rpt.id}</td>
                  <td className="p-3 font-semibold text-gray-800">{rpt.type}</td>
                  <td className="p-3 text-gray-600">{rpt.dateRange}</td>
                  <td className="p-3 text-gray-600">{rpt.generatedBy}</td>
                  <td className="p-3 font-mono text-gray-500">
                    {new Date(rpt.generatedAt).toLocaleString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="p-3 font-mono text-gray-500">{rpt.fileSize}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDownload(rpt)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-[#1F3A6E] hover:bg-blue-50 border border-blue-200 rounded font-semibold"
                    >
                      <Download size={11} /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
