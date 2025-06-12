import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportToExcel = (data, fileName = 'usuarios') => {
  const worksheet = utils.json_to_sheet(data);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, 'Usuarios');
  writeFile(workbook, `${fileName}.xlsx`);
};

export const exportToPDF = (data, fileName = 'usuarios') => {
  const doc = new jsPDF();
  
  // Título
  doc.text('Listado de Usuarios', 14, 15);
  
  // Tabla
  doc.autoTable({
    head: [['Nombre', 'Email', 'Roles']],
    body: data.map(user => [
      user.username,
      user.email,
      (user.roles || [user.role]).join(', ')
    ]),
    startY: 25
  });
  
  doc.save(`${fileName}.pdf`);
};