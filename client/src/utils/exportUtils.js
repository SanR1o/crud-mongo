import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToExcel = (data, fileName = 'usuarios') => {
  const worksheet = utils.json_to_sheet(data);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, 'Usuarios');
  writeFile(workbook, `${fileName}.xlsx`);
};

export const exportToPDF = (data, fileName = 'usuarios') => {
  const doc = new jsPDF();

  doc.text('Listado de Usuarios', 14, 15);

  if (!data || data.length === 0) {
    doc.text('No hay datos para exportar.', 14, 25);
    doc.save(`${fileName}.pdf`);
    return;
  }

  // Extraer columnas dinámicamente desde las claves del primer objeto
  const columns = Object.keys(data[0]);

  autoTable(doc, {
    head: [columns],
    body: data.map(row => columns.map(col => row[col])),
    startY: 25,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [41, 128, 185] }
  });

  doc.save(`${fileName}.pdf`);
};