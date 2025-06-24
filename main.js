let tarifas = {};

async function loadTarifas() {
  const res = await fetch("tarifas_por_tipo.json");
  tarifas = await res.json();
  tarifas["2.0TD"].forEach((t, i) =>
    document.getElementById("oferta_20td").add(new Option(t.oferta, i))
  );
}
loadTarifas();

function calcular(tipo) {
  const id = "20";
  const idx = document.getElementById(`oferta_${tipo}`).value;
  const t = tarifas["2.0TD"][idx];

  const dias = parseFloat(document.getElementById(`dias${id}`).value) || 0;
  const kw = parseFloat(document.getElementById(`potencia${id}`).value) || 0;
  const consumo1 = parseFloat(document.getElementById(`consumo1_${id}`).value) || 0;
  const consumo2 = parseFloat(document.getElementById(`consumo2_${id}`).value) || 0;
  const consumo3 = parseFloat(document.getElementById(`consumo3_${id}`).value) || 0;
  const alquiler = parseFloat(document.getElementById(`alquiler${id}`).value) || 0;
  const bono = parseFloat(document.getElementById(`bono${id}`).value) || 0;
  const iva = parseFloat(document.getElementById(`iva${id}`).value) || 0;
  const factura = parseFloat(document.getElementById(`factura${id}`).value) || 0;

  const pot1 = kw * dias * (t.potencia.P1 || 0);
  const pot2 = kw * dias * (t.potencia.P2 || 0);
  const ene1 = consumo1 * (t.consumo.P1 || 0);
  const ene2 = consumo2 * (t.consumo.P2 || 0);
  const ene3 = consumo3 * (t.consumo.P3 || 0);

  const bono_total = bono * dias;
  const beneficio_total = (t.beneficio_unico || 0) * dias;

  const base = pot1 + pot2 + ene1 + ene2 + ene3 + bono_total;
  const imp_elec = base * 0.0511;
  const subtotal = base + imp_elec + alquiler + beneficio_total;
  const iva_valor = subtotal * (iva / 100);
  const total = subtotal + iva_valor;

  const ahorro = factura - total;
  const ahorro_anual = (ahorro / dias) * 360;

  const resultado = document.getElementById("resultado_20td");

  resultado.style.backgroundColor = "#d4f7d4";
  resultado.style.transform = "scale(1.05)";
  setTimeout(() => {
    resultado.style.transform = "scale(1)";
  }, 150);

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

  // Ajustar las barras con escala lineal
  const valorActual = Math.max(factura, 0);
  const valorNueva = Math.max(total, 0);
  const maxVal = Math.max(valorActual, valorNueva, 1);

  const porcentajeActual = (valorActual / maxVal) * 100;
  const porcentajeNueva = (valorNueva / maxVal) * 100;

  document.getElementById("barra-actual").style.height = porcentajeActual + "%";
  document.getElementById("barra-nueva").style.height = porcentajeNueva + "%";
}

function autoCalcular20td() {
  calcular("20td");
}

document.querySelectorAll("input, select").forEach(input => {
  input.addEventListener("input", autoCalcular20td);
});
