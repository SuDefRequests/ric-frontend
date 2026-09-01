import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateAavishkarPDF = (formData) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;

  // Colors
  const maroonPrimary = [128, 0, 0];
  const neutralDark = [30, 30, 30];
  const neutralLight = [248, 248, 248];

// --- 1. Institutional Header Banner ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...maroonPrimary);
  doc.text(
    'LOKNETE GOPINATHJI MUNDE INSTITUTE OF ENGINEERING EDUCATION AND RESEARCH,',
    pageWidth / 2,
    13,
    { align: 'center' }
  );
  doc.text('NASHIK', pageWidth / 2, 18, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(...neutralDark);
  doc.text('AAVISHKAR RESEARCH CONVENTION 2026–2027', pageWidth / 2, 24, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Internal College Scrutiny & Student Research Project Registration Form', pageWidth / 2, 29, { align: 'center' });

  // Divider Line
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.4);
  doc.line(margin, 32, pageWidth - margin, 32);

  // --- 2. Section 1: Project & Faculty Guide Details ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...maroonPrimary);
  doc.text('1. Project & Mentor Details', margin, 38);

  const metaData = [
    [
      { content: 'Project Title', styles: { fontStyle: 'bold', cellWidth: 42 } },
      { content: formData.projectTitle || 'N/A' },
    ],
    [
      { content: 'Research Theme / Category', styles: { fontStyle: 'bold' } },
      { content: formData.theme || 'N/A' },
    ],
    [
      { content: 'Level of Study', styles: { fontStyle: 'bold' } },
      { content: formData.level || 'Undergraduate (UG)' },
    ],
    [
      { content: 'Faculty Guide Name', styles: { fontStyle: 'bold' } },
      { content: formData.guideName || 'N/A' },
    ],
    [
      { content: 'Guide Department', styles: { fontStyle: 'bold' } },
      { content: formData.guideDepartment || 'N/A' },
    ],
  ];

  autoTable(doc, {
    startY: 40,
    margin: { left: margin, right: margin },
    body: metaData,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2,
      textColor: neutralDark,
      lineColor: [210, 210, 210],
      lineWidth: 0.2,
    },
    columnStyles: {
      0: { fillColor: neutralLight, textColor: [50, 50, 50] },
    },
  });

  
  // --- 3. Section 2: Research Team Members ---
  const currentYAfterMeta = doc.lastAutoTable.finalY + 5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...maroonPrimary);
  doc.text('2. Research Presenters (2 to 3 Members)', margin, currentYAfterMeta);

  const memberRows = (formData.members || []).map((m, idx) => [
    idx + 1,
    idx === 0 ? `${m.name || 'N/A'} (Lead)` : m.name || 'N/A',
    `${m.branch || 'N/A'} (${m.year || 'N/A'})`,
    m.gender || 'N/A',
    m.caste || 'N/A',
    m.phone || 'N/A',
    m.email || 'N/A',
  ]);

  autoTable(doc, {
    startY: currentYAfterMeta + 2,
    margin: { left: margin, right: margin },
    head: [['S.N', 'Full Name', 'Branch & Year', 'Gender', 'Category', 'Contact No.', 'Email ID']],
    body: memberRows,
    theme: 'grid',
    headStyles: {
      fillColor: maroonPrimary,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7.5,
      halign: 'center',
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 2,
      textColor: neutralDark,
      valign: 'middle',
      lineColor: [210, 210, 210],
      lineWidth: 0.2,
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      3: { halign: 'center', cellWidth: 16 },
      4: { halign: 'center', cellWidth: 16 },
      5: { cellWidth: 24 },
    },
  });

  // --- 4. Section 3: Abstract ---
  const currentYAfterMembers = doc.lastAutoTable.finalY + 5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...maroonPrimary);
  doc.text('3. Innovation Abstract / Executive Summary', margin, currentYAfterMembers);

  autoTable(doc, {
    startY: currentYAfterMembers + 2,
    margin: { left: margin, right: margin },
    body: [[formData.abstract || 'No abstract provided.']],
    theme: 'grid',
    styles: {
      fontSize: 7.5,
      cellPadding: 2.5,
      textColor: neutralDark,
      overflow: 'linebreak',
      lineColor: [210, 210, 210],
      lineWidth: 0.2,
    },
  });

  // --- 5. Section 4: Declaration ---
  const currentYAfterAbstract = doc.lastAutoTable.finalY + 5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...maroonPrimary);
  doc.text('4. Declaration', margin, currentYAfterAbstract);

  const declarationText =
    'We hereby declare that all information submitted in this form is true and original to the best of our knowledge. ' +
    'All team members are bonafide students of Loknete Gopinathji Munde Institute of Engineering Education and Research, Nashik, ' +
    'and have not submitted this exact project under multiple registrations. We agree to strictly abide by the rules, ethical research practices, ' +
    'and guidelines laid down by Savitribai Phule Pune University (SPPU) and the Institute ARC Committee for Aavishkar 2026–2027.';

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(60, 60, 60);
  doc.text(declarationText, margin, currentYAfterAbstract + 4, {
    maxWidth: pageWidth - 2 * margin,
    align: 'justify',
    lineHeightFactor: 1.3,
  });

  // --- 6. Signature Footers ---
  const signY = currentYAfterAbstract + 26;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...neutralDark);

  const colWidth = (pageWidth - 2 * margin) / 4;

  const signatures = [
    'Signature of Team Lead',
    'Signature of Guide',
    'ARC Coordinator',
    'Signature/Seal of HOD',
  ];

  signatures.forEach((label, i) => {
    const x = margin + i * colWidth;
    doc.setDrawColor(150, 150, 150);
    doc.line(x + 2, signY - 3, x + colWidth - 6, signY - 3);
    doc.text(label, x + 2, signY + 2);
  });

  const formattedDate = new Date().toLocaleDateString('en-GB');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(110, 110, 110);
  doc.text(`Date of Generation: ${formattedDate}`, margin, signY + 9);

  // Save document
  const cleanTitle = (formData.projectTitle || 'Aavishkar_Project')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .slice(0, 20);

  doc.save(`${cleanTitle}_Aavishkar_Registration_Slip.pdf`);
};