import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const generateContractPDF = async (contractData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const fileName = `contract-${contractData.contractNumber}.pdf`;
      const filePath = path.join(process.cwd(), 'uploads', 'contracts', fileName);
      
      // Ensure directory exists
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);
      
      // Header
      doc.fontSize(20).text('VEHICLE RENTAL AGREEMENT', { align: 'center' });
      doc.moveDown();
      doc.fontSize(10).text(`Contract Number: ${contractData.contractNumber}`, { align: 'right' });
      doc.text(`Date: ${new Date(contractData.generatedAt).toLocaleDateString()}`, { align: 'right' });
      doc.moveDown(2);
      
      // Parties
      doc.fontSize(14).text('PARTIES', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10);
      doc.text('Rental Company (Owner):', { continued: false });
      doc.text(`Name: ${contractData.owner.name}`);
      doc.text(`Email: ${contractData.owner.email}`);
      doc.moveDown();
      
      doc.text('Renter:', { continued: false });
      doc.text(`Name: ${contractData.renter.name}`);
      doc.text(`Email: ${contractData.renter.email}`);
      doc.text(`Phone: ${contractData.renter.phone || 'N/A'}`);
      doc.text(`Address: ${contractData.renter.address || 'N/A'}`);
      doc.moveDown(2);
      
      // Vehicle Details
      doc.fontSize(14).text('VEHICLE DETAILS', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10);
      doc.text(`Vehicle: ${contractData.vehicle.name}`);
      doc.text(`Brand: ${contractData.vehicle.brand}`);
      doc.text(`Model: ${contractData.vehicle.model}`);
      doc.text(`Year: ${contractData.vehicle.year}`);
      doc.text(`License Plate: ${contractData.vehicle.licensePlate || 'N/A'}`);
      doc.moveDown(2);
      
      // Rental Details
      doc.fontSize(14).text('RENTAL DETAILS', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10);
      doc.text(`Start Date: ${new Date(contractData.rental.startDate).toLocaleString()}`);
      doc.text(`End Date: ${new Date(contractData.rental.endDate).toLocaleString()}`);
      doc.text(`Pickup Location: ${contractData.rental.pickupLocation}`);
      doc.text(`Delivery Option: ${contractData.rental.deliveryOption ? 'Yes' : 'No'}`);
      doc.text(`Total Price: $${contractData.rental.totalPrice.toFixed(2)}`);
      doc.moveDown(2);
      
      // Terms and Conditions
      doc.fontSize(14).text('TERMS AND CONDITIONS', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(9);
      
      const terms = contractData.terms;
      Object.entries(terms).forEach(([key, value]) => {
        const title = key.replace(/([A-Z])/g, ' $1').trim();
        doc.text(`${title.charAt(0).toUpperCase() + title.slice(1)}:`, { continued: true, underline: true });
        doc.text(` ${value}`, { underline: false });
        doc.moveDown(0.5);
      });
      
      doc.moveDown(2);
      
      // Signature Section
      doc.fontSize(12).text('SIGNATURES', { underline: true });
      doc.moveDown(2);
      
      doc.fontSize(10);
      doc.text('Renter Signature: _________________________', { continued: false });
      doc.moveDown(0.5);
      doc.text(`Name: ${contractData.renter.name}`);
      doc.text('Date: _________________________');
      doc.moveDown(2);
      
      doc.text('Owner Signature: _________________________', { continued: false });
      doc.moveDown(0.5);
      doc.text(`Name: ${contractData.owner.name}`);
      doc.text('Date: _________________________');
      
      // Footer
      doc.fontSize(8).text(
        'This is a legally binding agreement. Please read carefully before signing.',
        50,
        doc.page.height - 50,
        { align: 'center' }
      );
      
      doc.end();
      
      stream.on('finish', () => {
        resolve({ filePath, fileName });
      });
      
      stream.on('error', (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};
