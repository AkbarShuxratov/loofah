const salesData = [
  { product: "Sponge", category: "Cleaning", price: 2.29, quantity: 3200000000, total: 7328000000 },
  { product: "Loofah", category: "Cleaning", price: 3.50, quantity: 1072000000, total: 3752000000 } 
];

const ctx = document.getElementById('salesChart').getContext('2d');
const salesChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: salesData.map(item => item.product),
    datasets: [{
      label: 'Total Sales ($)',
      data: salesData.map(item => item.total),
      backgroundColor: ['rgba(59, 130, 246, 0.6)', 'rgba(16, 185, 129, 0.6)'],
      borderColor: ['rgba(59, 130, 246, 1)', 'rgba(16, 185, 129, 1)'],
      borderWidth: 2
    }]
  },
  options: {
    animation: {
      duration: 1200,
      easing: 'easeOutQuart'
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Sales ($)',
          color: '#1f2937',
          font: { size: 14 }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Products',
          color: '#1f2937',
          font: { size: 14 }
        }
      }
    },
    plugins: {
      legend: {
        labels: { color: '#1f2937' }
      }
    }
  }
});

let currentSort = { column: 'product', direction: 'asc' };

function renderTable(data) {
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = '';
  data.forEach(item => {
    const row = document.createElement('tr');
    row.className = 'animate-slide border-b border-gray-200 text-gray-700';
    row.innerHTML = `
      <td class="p-4">${item.product}</td>
      <td class="p-4">${item.category}</td>
      <td class="p-4">$${item.price.toFixed(2)}</td>
      <td class="p-4">${item.quantity.toLocaleString()}</td>
      <td class="p-4">$${item.total.toLocaleString()}</td>
    `;
    tbody.appendChild(row);
  });
}

function sortData(data, column, direction) {
  return [...data].sort((a, b) => {
    const valA = a[column];
    const valB = b[column];
    if (typeof valA === 'string') {
      return direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return direction === 'asc' ? valA - valB : valB - valA;
  });
}

function filterData() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const category = document.getElementById('categoryFilter').value;
  const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
  const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;

  const filteredData = salesData.filter(item =>
    item.product.toLowerCase().includes(search) &&
    (!category || item.category === category) &&
    item.price >= minPrice &&
    item.price <= maxPrice
  );

  const sortedData = sortData(filteredData, currentSort.column, currentSort.direction);
  renderTable(sortedData);

  salesChart.data.labels = sortedData.map(item => item.product);
  salesChart.data.datasets[0].data = sortedData.map(item => item.total);
  salesChart.update();
}

document.querySelectorAll('.filters input, .filters select').forEach(element => {
  element.addEventListener('input', () => {
    element.classList.add('animate-fade');
    filterData();
    setTimeout(() => element.classList.remove('animate-fade'), 500);
  });
});

document.querySelectorAll('th[data-sort]').forEach(th => {
  th.addEventListener('click', () => {
    const column = th.dataset.sort;
    if (currentSort.column === column) {
      currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      currentSort.column = column;
      currentSort.direction = 'asc';
    }

    document.querySelectorAll('th .sort-arrow').forEach(arrow => arrow.textContent = '↕');
    th.querySelector('.sort-arrow').textContent = currentSort.direction === 'asc' ? '↑' : '↓';

    filterData();
  });
});

filterData();
