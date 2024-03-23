import { PRODUCT_PRICES, generateData } from './generate.js';

const RECORDS_N = 1000;
const records = generateData(RECORDS_N);
const validRecords = filterValidRecords(records);
const salesData = createSalesData(validRecords);

const tableElement = document.createElement('table');
const productKeys = Object.keys(PRODUCT_PRICES);
const itemsPerPageSelect = document.createElement('select');
itemsPerPageSelect.innerHTML = '<option value="10">10</option><option value="50">50</option><option value="100">100</option>';
itemsPerPageSelect.addEventListener('change', (event) => {
    itemsPerPage = parseInt(event.target.value);
    displayItems();
});

const prevButton = document.createElement('button');
prevButton.textContent = 'Предыдущая страница';
prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayItems();
    }
});

const nextButton = document.createElement('button');
nextButton.textContent = 'Следующая страница';
nextButton.addEventListener('click', () => {
    const totalPages = Math.ceil(salesData.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayItems();
    }
});

const paginationContainer = document.createElement('div');
paginationContainer.id = 'paginationContainer';
paginationContainer.appendChild(prevButton);
paginationContainer.appendChild(itemsPerPageSelect);
paginationContainer.appendChild(nextButton);

tableElement.appendChild(paginationContainer);


const tableHead = document.createElement('thead');
const tableBody = document.createElement('tbody');
tableElement.appendChild(tableHead);
tableElement.appendChild(tableBody);
document.getElementById('salesTable').appendChild(tableElement);

let currentPage = 1;
let itemsPerPage = parseInt(itemsPerPageSelect.value);

displayItems();

function filterValidRecords(array) {
    let validRecords = [];
    validRecords = array.filter(({ company, product, count }) => company && product && count > 0);
    return validRecords.sort((obj1, obj2) => obj1.company.match(/\d+/g) - obj2.company.match(/\d+/g));
}

function createSalesData(records) {
    const salesData = {};

    records.forEach(({ company, product, count }) => {
        if (!salesData[company]) {
            salesData[company] = {};
        }
        if (!salesData[company][product]) {
            salesData[company][product] = count;
        } else {
            salesData[company][product] += count;
        }
    });

    const salesArray = [];
    for (const company in salesData) {
        const companyData = { company: company };
        for (const product in salesData[company]) {
            companyData[product] = salesData[company][product];
        }
        salesArray.push(companyData);
    }

    return salesArray;
}
function displayItems() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToShow = salesData.slice(startIndex, endIndex);

    tableHead.innerHTML = '';

    const headerRow = document.createElement('tr');
    const companyHeader = document.createElement('th');
    companyHeader.textContent = 'Company';
    headerRow.appendChild(companyHeader);
    productKeys.forEach(product => {
        const headerCell = document.createElement('th');
        headerCell.textContent = product + " (шт.)";
        headerRow.appendChild(headerCell);

        const priceHeaderCell = document.createElement('th');
        priceHeaderCell.textContent = product + " (в руб.)";
        headerRow.appendChild(priceHeaderCell);
    });
    const totalPriceHeaderCell = document.createElement('th');
    totalPriceHeaderCell.textContent = 'Общая цена каждого товара (руб.)';
    headerRow.appendChild(totalPriceHeaderCell);
    tableHead.appendChild(headerRow);

    tableBody.innerHTML = '';

    let totalUnitsSold = {};
    let totalSalesPrice = 0;

    itemsToShow.forEach(rowData => {
        const row = document.createElement('tr');
        const companyCell = document.createElement('td');
        companyCell.textContent = rowData.company;
        row.appendChild(companyCell);

        let totalCompanyPrice = 0;

        productKeys.forEach(product => {
            const quantityCell = document.createElement('td');
            quantityCell.textContent = rowData[product] || 0;
            row.appendChild(quantityCell);

            const priceCell = document.createElement('td');
            const totalPrice = (rowData[product] || 0) * PRODUCT_PRICES[product];
            priceCell.textContent = totalPrice.toFixed(2) + " руб.";
            row.appendChild(priceCell);

            totalUnitsSold[product] = (totalUnitsSold[product] || 0) + (rowData[product] || 0);
            totalCompanyPrice += totalPrice;
        });

        const totalPriceCell = document.createElement('td');
        totalPriceCell.textContent = totalCompanyPrice.toFixed(2);
        row.appendChild(totalPriceCell);

        totalSalesPrice += totalCompanyPrice;

        tableBody.appendChild(row);
    });

    const totalRow = document.createElement('tr');
    const totalLabelCell = document.createElement('td');
    totalLabelCell.textContent = 'Общее количество каждого проданного товара + общая цена';
    totalRow.appendChild(totalLabelCell);

    productKeys.forEach(product => {
        const totalUnitsSoldCell = document.createElement('td');
        totalUnitsSoldCell.textContent = totalUnitsSold[product] || 0;
        totalRow.appendChild(totalUnitsSoldCell);

        const emptyCell = document.createElement('td');
        totalRow.appendChild(emptyCell);
    });

    const totalSalesPriceCell = document.createElement('td');
    totalSalesPriceCell.textContent = totalSalesPrice.toFixed(2);
    totalRow.appendChild(totalSalesPriceCell);

    tableBody.appendChild(totalRow);

    const averageRow = document.createElement('tr');
    const averageLabelCell = document.createElement('td');
    averageLabelCell.textContent = 'Среднее количество проданного товара + средняя цена за продукт';
    averageRow.appendChild(averageLabelCell);

    productKeys.forEach(product => {
        const averageUnitsSoldCell = document.createElement('td');
        const averageUnitsSold = totalUnitsSold[product] / 2 || 0;
        averageUnitsSoldCell.textContent = averageUnitsSold.toFixed(0);
        averageRow.appendChild(averageUnitsSoldCell);

        const emptyCell = document.createElement('td');
        averageRow.appendChild(emptyCell);
    });

    const averagePriceCell = document.createElement('td');
    const averagePrice = totalSalesPrice / (itemsToShow.length * productKeys.length) || 0;
    averagePriceCell.textContent = averagePrice.toFixed(2);
    averageRow.appendChild(averagePriceCell);

    tableBody.appendChild(averageRow);
}