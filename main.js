let tarifas = {};

async function loadTarifas() {
  const res = await fetch("tarifas_por_tipo.json");
  tarifas = await res.json();
  if (tarifas["3.0TD"]) {
  tarifas["3.0TD"].forEach((t, i) =>
    document.getElementById("oferta_30td").add(new Option(t.oferta, i))
  );
}
}
loadTarifas();

function calcular30td() {
  const idx = document.getElementById("oferta_30td").value;
  const t = tarifas["3.0TD"][idx];

  const dias = parseFloat(document.getElementById("dias30").value) || 0;
  const alquiler = parseFloat(document.getElementById("alquiler30").value) || 0;
  const bono = parseFloat(document.getElementById("bono30").value) || 0;
  const iva = parseFloat(document.getElementById("iva30").value) || 0;
  const factura = parseFloat(document.getElementById("factura30").value) || 0;

  let totalPotencia = 0;
  let totalConsumo = 0;

  for (let i = 1; i <= 6; i++) {
    const pot = parseFloat(document.getElementById(`potencia30_p${i}`).value) || 0;
    const con = parseFloat(document.getElementById(`consumo30_p${i}`).value) || 0;
    totalPotencia += pot * dias * (t.potencia[`P${i}`] || 0);
    totalConsumo += con * (t.consumo[`P${i}`] || 0);
  }

  const bono_total = bono * dias;
  const beneficio_total = (t.beneficio_unico || 0) * dias;
  const base = totalPotencia + totalConsumo + bono_total;
  const imp_elec = base * 0.0511;
  const subtotal = base + imp_elec + alquiler + beneficio_total;
  const iva_valor = subtotal * (iva / 100);
  const total = subtotal + iva_valor;

  const ahorro = factura - total;
  const ahorro_anual = (ahorro / dias) * 360;

  const resultado = document.getElementById("resultado_30td");
  const claseAhorro = ahorro >= 0 ? "ahorro-verde" : "ahorro-rojo";

  resultado.innerHTML = `
    <div class="resultado-principal">
      <strong>Factura actual:</strong> <span class="factura-actual-value">` + factura.toFixed(2) + ` €</span><br>
      <strong>Factura nueva:</strong> <span class="factura-nueva-value">` + total.toFixed(2) + ` €</span><br>
      <span class="` + claseAhorro + `">Ahorro: ` + ahorro.toFixed(2) + ` €</span><br>
      Ahorro anual: ` + ahorro_anual.toFixed(2) + ` €<br>
    </div>
    <div class="promo-box">
      <strong>Promoción oferta</strong><br>
      ` + (t.promocion || "Ninguna") + `
    </div>
  `;

  const maxVal = Math.max(factura, total, 1);
  document.getElementById("barra-actual").style.height = (factura / maxVal) * 100 + "%";
  document.getElementById("barra-nueva").style.height = (total / maxVal) * 100 + "%";
}

document.querySelectorAll("input, select").forEach(el => {
  el.addEventListener("input", calcular30td);
});
