// PDF-export — adviesrapport als A4-PDF.
// Gebruikt jsPDF + html2canvas voor 1-op-1 rendering van het advies-scherm.

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { ProjectAdvies } from '../types';
import { adviesLabel } from './scoring';

/**
 * Genereert een PDF van de adviesrapport-pagina en biedt deze aan als download.
 * Werkt door het DOM-element met id 'advies-rapport' om te zetten naar canvas → PDF.
 */
export async function downloadAdviesAlsPdf(advies: ProjectAdvies): Promise<void> {
  const element = document.getElementById('advies-rapport');
  if (!element) {
    alert('Kon adviesrapport niet vinden.');
    return;
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ECE9E2',
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position -= pdfHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  const naam = advies.projectinfo.naam.replace(/[^a-z0-9]/gi, '_') || 'project';
  pdf.save(`Adviesrapport_${naam}_${advies.datumAdvies}.pdf`);
}

/**
 * Alternatief: exporteer naar JSON (handig voor archivering / vervolg-analyse).
 */
export function downloadAdviesAlsJson(advies: ProjectAdvies): void {
  const blob = new Blob([JSON.stringify(advies, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const naam = advies.projectinfo.naam.replace(/[^a-z0-9]/gi, '_') || 'project';
  a.download = `Advies_${naam}_${advies.datumAdvies}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Console-friendly samenvatting (debug / log).
 */
export function adviesSamenvatting(advies: ProjectAdvies): string {
  const label = adviesLabel(advies.totaalAdvies);
  return (
    `Project: ${advies.projectinfo.naam}\n` +
    `Totaalscore: ${advies.totaalScore}/100 → ${label.label}\n` +
    `CO₂-besparing: ${Math.round(advies.totaalCo2Besparing)} kg over ${advies.streams.length} stromen`
  );
}
