import * as Print from  "expo-print";
import * as Sharing from "expo-sharing";

type Medicamento = {
  id: string;
  nombre: string;
  dosis: string;
  horario: string;
  dias: string;
};

type SignosVitales = {
  presion: string;
  glucosa: string;
  peso: string;
} | null;

export async function generarReportePDF(
  email: string,
  medicamentos: Medicamento[],
  signosVitales: SignosVitales
) {
  const fecha = new Date().toLocaleDateString("es-HN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const filaMedicamentos = medicamentos.length > 0
    ? medicamentos.map((m) => `
        <tr>
          <td>${m.nombre}</td>
          <td>${m.dosis}</td>
          <td>${m.horario}</td>
          <td>${m.dias}</td>
        </tr>`).join("")
    : `<tr><td colspan="4" style="text-align:center;color:#888;">Sin medicamentos registrados</td></tr>`;

  const signosHTML = signosVitales
    ? `
      <div class="signos">
        <div class="signo-card"><span class="label">Presión</span><span class="value">${signosVitales.presion}</span></div>
        <div class="signo-card"><span class="label">Glucosa</span><span class="value">${signosVitales.glucosa}</span></div>
        <div class="signo-card"><span class="label">Peso</span><span class="value">${signosVitales.peso}</span></div>
      </div>`
    : `<p style="color:#888;">Sin signos vitales registrados</p>`;

  const html = `
    <html>
    <head>
      <meta charset="utf-8"/>
      <style>
        body { font-family: Arial, sans-serif; padding: 32px; color: #1a1a1a; }
        h1 { color: #2563eb; font-size: 22px; margin-bottom: 4px; }
        .subtitle { color: #555; font-size: 13px; margin-bottom: 28px; }
        h2 { font-size: 15px; font-weight: 600; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 28px; }
        th { background: #2563eb; color: white; padding: 9px 12px; text-align: left; font-size: 13px; }
        td { padding: 8px 12px; font-size: 13px; border-bottom: 1px solid #f0f0f0; }
        tr:nth-child(even) td { background: #f8fafc; }
        .signos { display: flex; gap: 16px; margin-bottom: 28px; }
        .signo-card { flex: 1; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; text-align: center; }
        .label { display: block; font-size: 11px; color: #888; margin-bottom: 6px; }
        .value { font-size: 18px; font-weight: 600; color: #2563eb; }
        .footer { margin-top: 40px; font-size: 11px; color: #aaa; text-align: center; }
      </style>
    </head>
    <body>
      <h1>Reporte de Salud</h1>
      <p class="subtitle">Paciente: ${email} &nbsp;|&nbsp; Generado el: ${fecha}</p>

      <h2>Signos Vitales (último registro)</h2>
      ${signosHTML}

      <h2>Medicamentos</h2>
      <table>
        <thead>
          <tr><th>Medicamento</th><th>Dosis</th><th>Horario</th><th>Días</th></tr>
        </thead>
        <tbody>
          ${filaMedicamentos}
        </tbody>
      </table>

      <p class="footer">Generado por ProyEnfermedad · Recordatorio de Medicamentos y Seguimiento de Salud</p>
    </body>
    </html>
  `;

  const { uri } = await Print.printToFileAsync({ html });

  const puedeCompartir = await Sharing.isAvailableAsync();
  if (puedeCompartir) {
    await Sharing.shareAsync(uri, {
      mimeType: "application/pdf",
      dialogTitle: "Compartir reporte de salud",
      UTI: "com.adobe.pdf",
    });
  } else {
    alert("Tu dispositivo no soporta compartir archivos");
  }
}