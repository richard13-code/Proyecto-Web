import { API_CONFIG, STORAGE_KEYS } from './config.js';
import { applyTheme } from './utils.js';

if (!sessionStorage.getItem('maison_admin_session')) {
  window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
  const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
  if (storedTheme) applyTheme(storedTheme);

  let chartSalesInstance = null;
  let chartProductInstance = null;
  let chartPaymentsInstance = null;
  let chartMarginsInstance = null;
  let chartStockAlertsInstance = null;

  // Simulacion de json
  const MOCK_SALES_HISTORY = {
    "2026": [145000, 168000, 134000, 192000, 210000, 155000, 120000, 140000, 175000, 220000, 260000, 310000],
    "2025": [110000, 95000, 115000, 140000, 130000, 98000, 88000, 105000, 125000, 160000, 195000, 240000]
  };

  const MOCK_PRODUCT_METRICS = {
    1:  { sold: 145, stock: 45 },  
    2:  { sold: 230, stock: 8 },   
    3:  { sold: 98,  stock: 60 },  
    4:  { sold: 180, stock: 12 },  
    5:  { sold: 112, stock: 34 },  
    6:  { sold: 45,  stock: 4 },   
    7:  { sold: 190, stock: 22 },  
    9:  { sold: 165, stock: 11 },  
    10: { sold: 87,  stock: 40 },  
    11: { sold: 124, stock: 55 },  
    12: { sold: 102, stock: 7 }   
  };

  // Navegacion 
  const links = document.querySelectorAll('.sidebar-link');
  const views = document.querySelectorAll('.admin-view');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = link.getAttribute('data-view');

      links.forEach(l => l.classList.remove('active-admin'));
      link.classList.add('active-admin');

      views.forEach(v => v.classList.add('d-none'));
      document.getElementById(`view-${targetView}`)?.classList.remove('d-none');
    });
  });

  /*¨API */
  fetch(API_CONFIG.PRODUCTS_URL)
    .then(res => {
      if (!res.ok) throw new Error('Fallo en la comunicación con el JSON de inventario');
      return res.json();
    })
    .then(products => {
      const dataset = products.map(p => ({
        ...p,
        unitsSold: MOCK_PRODUCT_METRICS[p.id]?.sold || 0,
        currentStock: MOCK_PRODUCT_METRICS[p.id]?.stock || 0
      }));

      initPanelGeneral(dataset);
      initReportesVenta();
      initGestorInventario(dataset);

      document.getElementById('filterSalesYear')?.addEventListener('change', (e) => renderSalesTimeline(e.target.value));
      document.getElementById('filterProductCategory')?.addEventListener('change', (e) => renderProductPerformance(dataset, e.target.value));
    })
    .catch(err => console.error('[Maison Engine Error]:', err));


  /* vista 1 panel general */
  function initPanelGeneral(products) {
    const salesTotal2026 = MOCK_SALES_HISTORY["2026"].reduce((a, b) => a + b, 0);
    document.getElementById('kpiSalesTotal').textContent = `$${salesTotal2026.toLocaleString()}`;

    const topItem = [...products].sort((a, b) => b.unitsSold - a.unitsSold)[0];
    if (topItem) {
      document.getElementById('kpiTopProduct').textContent = topItem.name;
      document.getElementById('kpiTopProductQty').textContent = `${topItem.unitsSold} u. vendidas`;
    }

    document.getElementById('kpiTicketAvg').textContent = `$${Math.round(salesTotal2026 / 1420).toLocaleString()}`;
    
    const ingresosSimulados = 2209000;
    const costosSimulados = 895000;
    const margenUtilidad = ((ingresosSimulados - costosSimulados) / ingresosSimulados) * 100;

    const kpiMarginEl = document.getElementById('kpiProfitMargin');
    if (kpiMarginEl) {
      kpiMarginEl.textContent = `${margenUtilidad.toFixed(1)}%`;
    }
    renderSalesTimeline("2026");
    renderStockComposition(products);
    renderProductPerformance(products, "todos");
  }

  function renderSalesTimeline(year) {
    const ctx = document.getElementById('chartSalesTimeline');
    if (!ctx) return;
    if (chartSalesInstance) chartSalesInstance.destroy();

    chartSalesInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [{
          data: MOCK_SALES_HISTORY[year],
          borderColor: '#c9a84c',
          backgroundColor: 'rgba(201, 168, 76, 0.05)',
          fill: true,
          tension: 0.25
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
  }

  function renderStockComposition(products) {
    const ctx = document.getElementById('chartStockCategories');
    if (!ctx) return;
    const cats = products.reduce((acc, p) => { acc[p.category] = (acc[p.category] || 0) + 1; return acc; }, {});

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Hombre', 'Mujer', 'Niños'],
        datasets: [{ data: [cats.hombre||0, cats.mujer||0, cats.ninos||0], backgroundColor: ['#2c2c2c', '#c9a84c', '#aaaaaa'] }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    });
  }

  function renderProductPerformance(products, categoryFilter) {
    const ctx = document.getElementById('chartProductPerformance');
    if (!ctx) return;
    if (chartProductInstance) chartProductInstance.destroy();

    let filtered = categoryFilter === 'todos' ? products : products.filter(p => p.category === categoryFilter);
    filtered.sort((a, b) => b.unitsSold - a.unitsSold);

    chartProductInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: filtered.map(p => p.name),
        datasets: [{
          data: filtered.map(p => p.unitsSold),
          backgroundColor: filtered.map((_, i) => i === 0 ? '#111111' : (i === filtered.length - 1 ? '#b84040' : '#c9a84c'))
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
  }


  /* vista 2 reportes de venta */
  function initReportesVenta() {
    const ctxPayments = document.getElementById('chartPaymentMethods');
    if (ctxPayments && !chartPaymentsInstance) {
      chartPaymentsInstance = new Chart(ctxPayments, {
        type: 'polarArea',
        data: {
          labels: ['Tarjeta de Crédito', 'PayPal', 'Efectivo (OXXO)', 'Transferencia'],
          datasets: [{
            data: [520, 340, 190, 110],
            backgroundColor: ['rgba(26,26,26,0.85)', 'rgba(201,168,76,0.85)', 'rgba(170,170,170,0.85)', 'rgba(44,44,44,0.85)']
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }

    const ctxMargins = document.getElementById('chartFinancialMargins');
    if (ctxMargins && !chartMarginsInstance) {
      chartMarginsInstance = new Chart(ctxMargins, {
        type: 'bar',
        data: {
          labels: ['Trimestre 1', 'Trimestre 2', 'Trimestre 3', 'Trimestre 4'],
          datasets: [
            { label: 'Ingresos Totales', data: [447000, 537000, 435000, 790000], backgroundColor: '#c9a84c' },
            { label: 'Costos de Operación', data: [180000, 210000, 195000, 310000], backgroundColor: '#2c2c2c' }
          ]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }
  }


  /* vista 3 gestor de inventario */
  function initGestorInventario(products) {
    const lowStockItems = products.filter(p => p.currentStock < 15);
    const ctxAlerts = document.getElementById('chartLowStockAlerts');

    if (ctxAlerts) {
      if (chartStockAlertsInstance) chartStockAlertsInstance.destroy();
      
      chartStockAlertsInstance = new Chart(ctxAlerts, {
        type: 'bar',
        data: {
          labels: lowStockItems.map(p => p.name),
          datasets: [{
            label: 'Existencias actuales',
            data: lowStockItems.map(p => p.currentStock),
            backgroundColor: '#b84040',
            barPercentage: 0.5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y', 
          plugins: { legend: { display: false } },
          scales: { x: { max: 20, beginAtZero: true } }
        }
      });
    }

    const tableBody = document.getElementById('inventoryTableBody');
    if (tableBody) {
      tableBody.innerHTML = '';
      products.forEach(p => {
        const tr = document.createElement('tr');
        
        let badgeHtml = '<span class="badge text-bg-success">Saludable</span>';
        if (p.currentStock <= 5) {
          badgeHtml = '<span class="badge text-bg-danger">Crítico (Reordenar)</span>';
        } else if (p.currentStock <= 12) {
          badgeHtml = '<span class="badge text-bg-warning">Bajo Stock</span>';
        }

        const finalImgPath = p.image.startsWith('http') ? p.image : p.image;

        tr.innerHTML = `
          <td>
            <div class="d-flex align-items-center">
              <img src="${finalImgPath}" style="width:36px; height:48px; object-fit:cover;" class="me-2 rounded-1">
              <span class="small fw-medium text-dark">${p.name}</span>
            </div>
          </td>
          <td class="text-uppercase small text-muted font-monospace" style="font-size:0.7rem;">${p.category}</td>
          <td class="small fw-normal text-dark">$${p.price.toLocaleString()}</td>
          <td class="fw-medium small text-dark">${p.currentStock} pzs</td>
          <td>${badgeHtml}</td>
        `;
        tableBody.appendChild(tr);
      });
    }
  }
});