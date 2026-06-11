const storage = window.localStorage;

function getData(key, fallback) {
    const raw = storage.getItem(key);
    if (!raw) return fallback;
    try {
        return JSON.parse(raw);
    } catch (error) {
        return fallback;
    }
}

function setData(key, value) {
    storage.setItem(key, JSON.stringify(value));
}

function showAlert(container, message, type = 'success') {
    if (!container) return;
    container.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
}

function initLocalDefaults() {
    if (!getData('landlordUsers')) {
        setData('landlordUsers', [{
            email: 'owner@nyumbapap.co.ke',
            password: 'owner123',
            name: 'Peter Landlord',
            contact: '+254786684923'
        }]);
    }
    if (!getData('tenantUsers')) {
        setData('tenantUsers', [{
            email: 'tenant@nyumbapap.co.ke',
            password: 'tenant123',
            name: 'Jane Tenant'
        }]);
    }
    if (!getData('managerUsers')) {
        setData('managerUsers', [{
            email: 'manager@nyumbapap.co.ke',
            password: 'manager123',
            name: 'John Manager'
        }]);
    }
    if (!getData('accountantUsers')) {
        setData('accountantUsers', [{
            email: 'accountant@nyumbapap.co.ke',
            password: 'accountant123',
            name: 'Mary Accountant'
        }]);
    }
    if (!getData('landlordPosts')) {
        setData('landlordPosts', [
            {
                title: 'Vacant Family House near Kibos Road',
                type: 'Rental',
                status: 'Vacant',
                address: 'Kibos Road, Kisumu',
                price: 'KSh 22,000 / month',
                contact: '+254 700 000 001',
                postedAt: new Date().toLocaleDateString()
            }
        ]);
    }
    if (!getData('activityLog')) {
        setData('activityLog', [
            {when: 'Today', activity: 'New landlord post submitted'},
            {when: 'Yesterday', activity: 'Tenant signed up'},
            {when: 'Yesterday', activity: 'Materials delivery request received'}
        ]);
    }
    if (!getData('managerReports')) {
        setData('managerReports', []);
    }
    if (!getData('buildingMedia')) {
        setData('buildingMedia', []);
    }
    if (!getData('billsRecords')) {
        setData('billsRecords', []);
    }
    if (!getData('salesRecords')) {
        setData('salesRecords', []);
    }
    if (!getData('treasuryRecords')) {
        setData('treasuryRecords', []);
    }
}

function renderHomeMaterials() {
    const grid = document.getElementById('material-grid');
    if (!grid) return;
    const materials = [
        {name: 'River Sand', price: 'KSh 3,200 / truck', description: 'Clean sand for blocks, plaster and foundation.', image: 'images/download.jpeg'},
        {name: 'Ballast Stones', price: 'KSh 3,800 / truck', description: 'Strong stones for concrete and roadbeds.', image: 'images/download.jpeg'},
        {name: 'Murram', price: 'KSh 2,800 / truck', description: 'Quality murram for site work and access roads.', image: 'images/download.jpeg'}
    ];
    grid.innerHTML = '';
    materials.forEach(item => {
        const card = document.createElement('div');
        card.className = 'col-md-4';
        card.innerHTML = `<div class="card h-100 shadow-sm border-0">
            <img src="${item.image}" class="card-img-top" alt="${item.name}" style="height:200px;object-fit:cover;">
            <div class="card-body">
                <h5 class="card-title">${item.name}</h5>
                <p class="card-text">${item.description}</p>
            </div>
            <div class="card-footer bg-white border-0 d-grid gap-2">
                <span class="text-primary fw-bold">${item.price}</span>
                <div class="d-flex gap-2">
                    <button class="btn btn-outline-primary btn-sm" type="button" onclick="buyMaterial('${item.name}','${item.price}')">Order Now</button>
                    <button class="btn btn-outline-secondary btn-sm" type="button" onclick="viewImage('${item.image}','${item.name}')">View Image</button>
                    <button class="btn btn-outline-secondary btn-sm" type="button" onclick="viewVideo('${item.video}','${item.name}')">Watch Video</button>
                </div>
            </div>
        </div>`;
        grid.appendChild(card);
    });
}

function viewImage(url, title) {
    const body = document.getElementById('mediaModalBody');
    const label = document.getElementById('mediaModalLabel');
    if (!body || !label) return;
    label.textContent = title;
    body.innerHTML = `<img src="${url}" alt="${title}" style="max-width:100%;height:auto;display:block;margin:0 auto;">`;
    const modal = new bootstrap.Modal(document.getElementById('mediaModal'));
    modal.show();
}

function viewVideo(url, title) {
    const body = document.getElementById('mediaModalBody');
    const label = document.getElementById('mediaModalLabel');
    if (!body || !label) return;
    label.textContent = title;
    body.innerHTML = `<div class="ratio ratio-16x9"><iframe src="${url}" frameborder="0" allowfullscreen></iframe></div>`;
    const modal = new bootstrap.Modal(document.getElementById('mediaModal'));
    modal.show();
}

function renderPropertyList() {
    const container = document.getElementById('property-list');
    if (!container) return;
    const properties = getData('landlordPosts', []);
    container.innerHTML = '';
    properties.forEach((p, index) => {
        const card = document.createElement('div');
        card.className = 'col-md-4';
        card.innerHTML = `<div class="card h-100 property-card border-0 shadow-sm">
            <div class="card-body">
                <span class="badge ${p.type === 'Sale' ? 'bg-danger' : 'bg-success'} mb-2">${p.type}</span>
                <h5 class="card-title fw-bold">${p.title}</h5>
                <p class="card-text text-muted">${p.address}</p>
                <p class="card-text">${p.price} • ${p.status}</p>
                <p class="small text-muted">Listed on ${p.postedAt}</p>
            </div>
            <div class="card-footer bg-white border-0 pb-3">
                <button class="btn btn-outline-primary btn-sm w-100" onclick="alert('Contact ${p.contact} for this property.')">View Contact</button>
            </div>
        </div>`;
        container.appendChild(card);
    });
}

function landlordLogin(event) {
    event.preventDefault();
    const email = document.getElementById('landlord-email').value.trim();
    const password = document.getElementById('landlord-password').value.trim();
    const users = getData('landlordUsers', []);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    const alertContainer = document.getElementById('landlord-alert');

    if (!user) {
        showAlert(alertContainer, 'Login failed. Please check your email and password.', 'danger');
        return;
    }
    storage.setItem('currentLandlord', JSON.stringify(user));
    showAlert(alertContainer, `Welcome back, ${user.name}! You can now post a vacant building.`, 'success');
    document.querySelector('.landlord-login-card').classList.add('d-none');
    document.querySelector('.landlord-post-card').classList.remove('d-none');
    renderLandlordPosts();
}

function landlordPost(event) {
    event.preventDefault();
    const title = document.getElementById('post-title').value.trim();
    const type = document.getElementById('post-type').value;
    const status = document.getElementById('post-status').value;
    const address = document.getElementById('post-address').value.trim();
    const price = document.getElementById('post-price').value.trim();
    const contact = document.getElementById('post-contact').value.trim();
    const alertContainer = document.getElementById('landlord-post-alert');

    if (!title || !address || !price || !contact) {
        showAlert(alertContainer, 'Please complete every field before posting.', 'warning');
        return;
    }
    const posts = getData('landlordPosts', []);
    posts.unshift({
        title, type, status, address, price, contact, postedAt: new Date().toLocaleDateString()
    });
    setData('landlordPosts', posts);
    showAlert(alertContainer, 'Your listing was posted successfully.', 'success');
    document.getElementById('landlord-post-form').reset();
    renderLandlordPosts();
}

function renderLandlordPosts() {
    const list = document.getElementById('landlord-posts');
    if (!list) return;
    const posts = getData('landlordPosts', []);
    list.innerHTML = '';
    posts.forEach(p => {
        const item = document.createElement('div');
        item.className = 'card mb-3 shadow-sm';
        item.innerHTML = `<div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h5 class="card-title mb-0">${p.title}</h5>
                <span class="badge ${p.status === 'Vacant' ? 'bg-success' : 'bg-secondary'}">${p.status}</span>
            </div>
            <p class="mb-1">${p.type} • ${p.address}</p>
            <p class="mb-1 text-primary fw-bold">${p.price}</p>
            <p class="mb-0"><strong>Contact:</strong> ${p.contact}</p>
            <p class="small text-muted mt-2">Posted ${p.postedAt}</p>
        </div>`;
        list.appendChild(item);
    });
}

function tenantSignup(event) {
    event.preventDefault();
    const name = document.getElementById('tenant-name').value.trim();
    const email = document.getElementById('tenant-email').value.trim();
    const password = document.getElementById('tenant-password').value.trim();
    const alertContainer = document.getElementById('tenant-signup-alert');
    if (!name || !email || !password) {
        showAlert(alertContainer, 'All fields are required for signup.', 'warning');
        return;
    }
    const users = getData('tenantUsers', []);
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        showAlert(alertContainer, 'This email is already registered.', 'danger');
        return;
    }
    users.push({name, email, password});
    setData('tenantUsers', users);
    showAlert(alertContainer, 'Signup successful! You can now sign in.', 'success');
    document.getElementById('tenant-signup-form').reset();
}

function tenantSignin(event) {
    event.preventDefault();
    const email = document.getElementById('tenant-login-email').value.trim();
    const password = document.getElementById('tenant-login-password').value.trim();
    const alertContainer = document.getElementById('tenant-signin-alert');
    const users = getData('tenantUsers', []);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) {
        showAlert(alertContainer, 'Sign in failed. Check email or password.', 'danger');
        return;
    }
    showAlert(alertContainer, `Welcome back, ${user.name}! Browse properties or contact a landlord.`, 'success');
    document.getElementById('tenant-login-form').reset();
}

function managerInit() {
    const posts = getData('landlordPosts', []);
    const tenants = getData('tenantUsers', []);
    const activities = getData('activityLog', []);
    const reports = getData('managerReports', []);
    document.getElementById('manager-post-count').textContent = posts.length;
    document.getElementById('manager-tenant-count').textContent = tenants.length;
    document.getElementById('manager-activity-count').textContent = activities.length;
    document.getElementById('manager-report-count').textContent = reports.length;
    const activityList = document.getElementById('activity-log');
    if (activityList) {
        activityList.innerHTML = '';
        activities.forEach(item => {
            const row = document.createElement('li');
            row.className = 'list-group-item d-flex justify-content-between align-items-center';
            row.innerHTML = `<span>${item.activity}</span><span class="badge bg-secondary rounded-pill">${item.when}</span>`;
            activityList.appendChild(row);
        });
    }
    renderManagerReports(reports);
}

function renderManagerReports(reports) {
    const list = document.getElementById('manager-reports');
    if (!list) return;
    list.innerHTML = '';
    if (!reports.length) {
        list.innerHTML = '<p class="text-muted">No reports yet. Create a sales report below.</p>';
        return;
    }
    reports.slice().reverse().forEach(report => {
        const card = document.createElement('div');
        card.className = 'card mb-3 shadow-sm';
        card.innerHTML = `<div class="card-body">
            <h5 class="card-title mb-1">${report.title}</h5>
            <p class="small text-muted mb-1">${report.date}</p>
            <p class="mb-0">${report.details}</p>
        </div>`;
        list.appendChild(card);
    });
}

function submitManagerReport(event) {
    event.preventDefault();
    const title = document.getElementById('report-title').value.trim();
    const details = document.getElementById('report-details').value.trim();
    const alertContainer = document.getElementById('manager-report-alert');
    if (!title || !details) {
        showAlert(alertContainer, 'Please add a report title and summary.', 'warning');
        return;
    }
    const reports = getData('managerReports', []);
    reports.push({ title, details, date: new Date().toLocaleString() });
    setData('managerReports', reports);
    showAlert(alertContainer, 'Report created and saved to the dashboard.', 'success');
    document.getElementById('manager-report-form').reset();
    managerInit();
}

function forgotPassword(event) {
    event.preventDefault();
    const email = document.getElementById('forgot-email').value.trim();
    const alertContainer = document.getElementById('forgot-alert');
    const landlordUsers = getData('landlordUsers', []);
    const tenantUsers = getData('tenantUsers', []);
    const found = landlordUsers.some(u => u.email.toLowerCase() === email.toLowerCase()) || tenantUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
        showAlert(alertContainer, 'Email not found. Please check the address and try again.', 'danger');
        return;
    }
    showAlert(alertContainer, 'A password reset link has been sent to your email address (simulated).', 'success');
    document.getElementById('forgot-password-form').reset();
}

function managerLogin(event) {
    event.preventDefault();
    const email = document.getElementById('manager-email').value.trim();
    const password = document.getElementById('manager-password').value.trim();
    const users = getData('managerUsers', []);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    const alertContainer = document.getElementById('manager-login-alert');

    if (!user) {
        showAlert(alertContainer, 'Login failed. Check your email and password.', 'danger');
        return;
    }
    storage.setItem('currentManager', JSON.stringify(user));
    showAlert(alertContainer, `Welcome, ${user.name}!`, 'success');
    document.querySelector('.manager-login-card').classList.add('d-none');
    document.querySelector('.manager-dashboard').classList.remove('d-none');
    managerDashboardInit();
}

function managerSignup(event) {
    event.preventDefault();
    const name = document.getElementById('manager-name').value.trim();
    const email = document.getElementById('manager-signup-email').value.trim();
    const password = document.getElementById('manager-signup-password').value;
    const confirmPassword = document.getElementById('manager-signup-confirm').value;
    const alertContainer = document.getElementById('manager-login-alert');

    if (!name || !email || !password || !confirmPassword) {
        showAlert(alertContainer, 'Please fill in every sign-up field.', 'warning');
        return;
    }
    if (password !== confirmPassword) {
        showAlert(alertContainer, 'Passwords do not match.', 'danger');
        return;
    }
    const users = getData('managerUsers', []);
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        showAlert(alertContainer, 'A manager account already exists with that email.', 'danger');
        return;
    }
    users.push({name, email, password});
    setData('managerUsers', users);
    showAlert(alertContainer, 'Sign up successful! Please sign in with your new manager account.', 'success');
    document.getElementById('manager-signup-form').reset();
    toggleManagerAuthTab('signin');
}

function toggleManagerAuthTab(tab) {
    const signinPanel = document.getElementById('manager-signin-panel');
    const signupPanel = document.getElementById('manager-signup-panel');
    const signinBtn = document.getElementById('manager-signin-toggle');
    const signupBtn = document.getElementById('manager-signup-toggle');

    if (tab === 'signup') {
        signinPanel.classList.add('d-none');
        signupPanel.classList.remove('d-none');
        signinBtn.classList.remove('active');
        signupBtn.classList.add('active');
    } else {
        signupPanel.classList.add('d-none');
        signinPanel.classList.remove('d-none');
        signupBtn.classList.remove('active');
        signinBtn.classList.add('active');
    }
}

function managerLogout() {
    storage.removeItem('currentManager');
    document.querySelector('.manager-login-card').classList.remove('d-none');
    document.querySelector('.manager-dashboard').classList.add('d-none');
    document.getElementById('manager-login-form').reset();
}

function getSalesRecords() {
    return getData('salesRecords', []);
}

function getTreasuryRecords() {
    return getData('treasuryRecords', []);
}

function updateTreasuryMetrics() {
    const records = getTreasuryRecords();
    const totalIncome = records.filter(r => r.type === 'Income').reduce((sum, r) => sum + r.amount, 0);
    const totalExpenses = records.filter(r => r.type === 'Expense').reduce((sum, r) => sum + r.amount, 0);
    const netBalance = totalIncome - totalExpenses;

    const incomeEl = document.getElementById('manager-treasury-income');
    const expensesEl = document.getElementById('manager-treasury-expenses');
    const balanceEl = document.getElementById('manager-treasury-balance');
    const countEl = document.getElementById('manager-treasury-count');

    if (incomeEl) incomeEl.textContent = `KSh ${totalIncome.toLocaleString()}`;
    if (expensesEl) expensesEl.textContent = `KSh ${totalExpenses.toLocaleString()}`;
    if (balanceEl) balanceEl.textContent = `KSh ${netBalance.toLocaleString()}`;
    if (countEl) countEl.textContent = records.length;
}

function renderTreasuryLedger() {
    const container = document.getElementById('treasury-ledger');
    if (!container) return;
    const records = getTreasuryRecords();
    container.innerHTML = '';
    if (!records.length) {
        container.innerHTML = '<p class="text-muted">No treasury transactions recorded yet.</p>';
        return;
    }

    records.slice(0, 10).forEach(record => {
        const row = document.createElement('div');
        row.className = 'list-group-item';
        row.innerHTML = `<div class="d-flex justify-content-between align-items-start">
            <div>
                <h6 class="mb-1">${record.description}</h6>
                <p class="mb-1 small text-muted">${record.category} • ${record.type}</p>
                <p class="small text-muted">${record.date}</p>
            </div>
            <span class="badge ${record.type === 'Income' ? 'bg-success' : 'bg-danger'}">KSh ${record.amount.toLocaleString()}</span>
        </div>`;
        container.appendChild(row);
    });
}

function recordTreasuryTransaction(event) {
    event.preventDefault();
    const type = document.getElementById('treasury-type').value;
    const category = document.getElementById('treasury-category').value;
    const description = document.getElementById('treasury-description').value.trim();
    const amount = parseFloat(document.getElementById('treasury-amount').value);
    const alertContainer = document.getElementById('treasury-alert');

    if (!type || !category || !description || !amount || amount <= 0) {
        showAlert(alertContainer, 'Please complete every treasury field and enter a positive amount.', 'warning');
        return;
    }
    const records = getTreasuryRecords();
    records.unshift({
        type,
        category,
        description,
        amount,
        date: new Date().toLocaleString()
    });
    setData('treasuryRecords', records);
    showAlert(alertContainer, `${type} transaction recorded successfully.`, 'success');
    document.getElementById('manager-treasury-form').reset();
    managerDashboardInit();
}

let managerSalesChart = null;

function renderManagerSalesChart() {
    const sales = getSalesRecords();
    const chartElement = document.getElementById('manager-sales-chart');
    if (!chartElement) return;

    if (managerSalesChart) {
        managerSalesChart.destroy();
        managerSalesChart = null;
    }

    const chartContainer = chartElement.parentElement;
    const existingMessage = chartContainer.querySelector('.chart-empty-message');
    if (!sales.length) {
        chartElement.style.display = 'none';
        if (!existingMessage) {
            chartContainer.insertAdjacentHTML('beforeend', '<p class="text-muted mb-0 chart-empty-message">No sales data available yet. Record sales in the accountant dashboard to populate this chart.</p>');
        }
        return;
    }

    if (existingMessage) {
        existingMessage.remove();
    }
    chartElement.style.display = 'block';
    const ctx = chartElement.getContext('2d');

    const recentSales = sales.slice(0, 8).reverse();
    const labels = recentSales.map(s => s.date.split(',')[0]);
    const amounts = recentSales.map(s => s.amount);

    managerSalesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Sales amount (KSh)',
                data: amounts,
                backgroundColor: 'rgba(54, 125, 255, 0.65)',
                borderColor: 'rgba(10, 80, 200, 0.9)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {display: false},
                    ticks: {color: '#0d6efd'}
                },
                y: {
                    beginAtZero: true,
                    ticks: {color: '#212529'}
                }
            },
            plugins: {
                legend: {display: false},
                tooltip: {callbacks: {label: context => `KSh ${context.formattedValue}`}}
            }
        }
    });
}

function postBuildingMedia(event) {
    event.preventDefault();
    const title = document.getElementById('media-title').value.trim();
    const location = document.getElementById('media-location').value.trim();
    const type = document.getElementById('media-type').value;
    const url = document.getElementById('media-url').value.trim();
    const description = document.getElementById('media-description').value.trim();
    const alertContainer = document.getElementById('media-alert');

    if (!title || !location || !type || !url) {
        showAlert(alertContainer, 'Please fill all required fields.', 'warning');
        return;
    }

    const media = getData('buildingMedia', []);
    media.unshift({title, location, type, url, description, postedAt: new Date().toLocaleString()});
    setData('buildingMedia', media);

    showAlert(alertContainer, `${type} posted successfully!`, 'success');
    document.getElementById('manager-media-form').reset();
    renderBuildingMedia();
}

function renderBuildingMedia() {
    const gallery = document.getElementById('media-gallery');
    if (!gallery) return;
    const media = getData('buildingMedia', []);
    gallery.innerHTML = '';
    if (!media.length) {
        gallery.innerHTML = '<p class="text-muted">No media posted yet.</p>';
        return;
    }
    media.forEach(item => {
        const col = document.createElement('div');
        col.className = 'col-md-4';
        col.innerHTML = `<div class="card shadow-sm h-100">
            <img src="${item.url}" alt="${item.title}" style="height: 200px; object-fit: cover;" class="card-img-top">
            <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
                <p class="card-text">${item.location}</p>
                <span class="badge bg-info">${item.type}</span>
                <p class="small text-muted mt-2">${item.description}</p>
                <p class="small text-muted">Posted: ${item.postedAt}</p>
            </div>
        </div>`;
        gallery.appendChild(col);
    });
    document.getElementById('manager-media-count').textContent = media.length;
}

function managerDashboardInit() {
    const posts = getData('landlordPosts', []);
    const activities = getData('activityLog', []);
    const reports = getData('managerReports', []);
    const sales = getSalesRecords();
    const totalSales = sales.reduce((sum, sale) => sum + (sale.amount || 0), 0);

    document.getElementById('manager-post-count').textContent = posts.length;
    document.getElementById('manager-activity-count').textContent = activities.length;
    document.getElementById('manager-total-sales').textContent = `KSh ${totalSales.toLocaleString()}`;
    
    const activityList = document.getElementById('activity-log');
    if (activityList) {
        activityList.innerHTML = '';
        activities.forEach(item => {
            const row = document.createElement('li');
            row.className = 'list-group-item d-flex justify-content-between align-items-center';
            row.innerHTML = `<span>${item.activity}</span><span class="badge bg-secondary rounded-pill">${item.when}</span>`;
            activityList.appendChild(row);
        });
    }
    renderBuildingMedia();
    renderManagerReports(reports);
    updateTreasuryMetrics();
    renderTreasuryLedger();
    renderManagerSalesChart();
}

function accountantLogin(event) {
    event.preventDefault();
    const email = document.getElementById('accountant-email').value.trim();
    const password = document.getElementById('accountant-password').value.trim();
    const users = getData('accountantUsers', []);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    const alertContainer = document.getElementById('accountant-login-alert');

    if (!user) {
        showAlert(alertContainer, 'Login failed. Check your email and password.', 'danger');
        return;
    }
    storage.setItem('currentAccountant', JSON.stringify(user));
    showAlert(alertContainer, `Welcome, ${user.name}!`, 'success');
    document.querySelector('.accountant-login-card').classList.add('d-none');
    document.querySelector('.accountant-dashboard').classList.remove('d-none');
    accountantDashboardInit();
}

function accountantLogout() {
    storage.removeItem('currentAccountant');
    document.querySelector('.accountant-login-card').classList.remove('d-none');
    document.querySelector('.accountant-dashboard').classList.add('d-none');
    document.getElementById('accountant-login-form').reset();
}

function recordSale(event) {
    event.preventDefault();
    const item = document.getElementById('sales-item').value.trim();
    const buyer = document.getElementById('sales-buyer').value.trim();
    const amount = parseFloat(document.getElementById('sales-amount').value);
    const method = document.getElementById('sales-method').value;
    const alertContainer = document.getElementById('sales-alert');

    if (!item || !buyer || !amount || !method) {
        showAlert(alertContainer, 'Please fill all fields.', 'warning');
        return;
    }

    const sales = getData('salesRecords', []);
    sales.unshift({item, buyer, amount, method, date: new Date().toLocaleString()});
    setData('salesRecords', sales);

    showAlert(alertContainer, `Sale recorded: KSh ${amount.toLocaleString()} for ${item}`, 'success');
    document.getElementById('sales-form').reset();
    accountantDashboardInit();
}

function addBill(event) {
    event.preventDefault();
    const description = document.getElementById('bill-description').value.trim();
    const vendor = document.getElementById('bill-vendor').value.trim();
    const amount = parseFloat(document.getElementById('bill-amount').value);
    const status = document.getElementById('bill-status').value;
    const alertContainer = document.getElementById('bill-alert');

    if (!description || !vendor || !amount) {
        showAlert(alertContainer, 'Please fill all required fields.', 'warning');
        return;
    }

    const bills = getData('billsRecords', []);
    bills.unshift({description, vendor, amount, status, date: new Date().toLocaleString()});
    setData('billsRecords', bills);

    showAlert(alertContainer, `Bill added: ${status} - KSh ${amount.toLocaleString()}`, 'success');
    document.getElementById('bill-form').reset();
    accountantDashboardInit();
}

function clearBill(billIndex) {
    const bills = getData('billsRecords', []);
    if (bills[billIndex]) {
        bills[billIndex].status = 'Cleared';
        bills[billIndex].clearedAt = new Date().toLocaleString();
        setData('billsRecords', bills);
        accountantDashboardInit();
    }
}

function renderSalesRecords() {
    const container = document.getElementById('sales-records');
    if (!container) return;
    const sales = getData('salesRecords', []);
    container.innerHTML = '';
    if (!sales.length) {
        container.innerHTML = '<p class="text-muted">No sales recorded yet.</p>';
        return;
    }
    sales.slice(0, 10).forEach(sale => {
        const item = document.createElement('div');
        item.className = 'list-group-item';
        item.innerHTML = `<div class="d-flex justify-content-between align-items-start">
            <div>
                <h6 class="mb-1">${sale.item}</h6>
                <p class="mb-1 small text-muted">${sale.buyer} • ${sale.method}</p>
                <p class="small text-muted">${sale.date}</p>
            </div>
            <span class="badge bg-success">KSh ${sale.amount.toLocaleString()}</span>
        </div>`;
        container.appendChild(item);
    });
}

function renderBillsList() {
    const container = document.getElementById('bills-list');
    if (!container) return;
    const bills = getData('billsRecords', []);
    container.innerHTML = '';
    if (!bills.length) {
        container.innerHTML = '<p class="text-muted">No bills recorded yet.</p>';
        return;
    }
    bills.forEach((bill, index) => {
        const item = document.createElement('div');
        item.className = 'list-group-item';
        item.innerHTML = `<div class="d-flex justify-content-between align-items-start">
            <div>
                <h6 class="mb-1">${bill.description}</h6>
                <p class="mb-1 small text-muted">${bill.vendor}</p>
                <p class="small text-muted">${bill.date}</p>
            </div>
            <div class="text-end">
                <span class="badge ${bill.status === 'Cleared' ? 'bg-success' : 'bg-warning'} mb-2 d-block">${bill.status}</span>
                ${bill.status === 'Pending' ? `<button class="btn btn-sm btn-outline-success" onclick="clearBill(${index})">Clear</button>` : `<small class="text-muted">Cleared: ${bill.clearedAt || ''}</small>`}
            </div>
        </div>`;
        container.appendChild(item);
    });
}

function accountantDashboardInit() {
    const bills = getData('billsRecords', []);
    const sales = getData('salesRecords', []);
    
    const clearedCount = bills.filter(b => b.status === 'Cleared').length;
    const pendingCount = bills.filter(b => b.status === 'Pending').length;
    const totalSales = sales.reduce((sum, s) => sum + s.amount, 0);

    document.getElementById('total-bills-count').textContent = bills.length;
    document.getElementById('cleared-bills-count').textContent = clearedCount;
    document.getElementById('pending-bills-count').textContent = pendingCount;
    document.getElementById('total-sales-amount').textContent = `KSh ${totalSales.toLocaleString()}`;

    renderSalesRecords();
    renderBillsList();
}

function forgotPasswordReset(event) {
    event.preventDefault();
    const email = document.getElementById('forgot-email').value.trim();
    const alertContainer = document.getElementById('forgot-alert');
    const landlordUsers = getData('landlordUsers', []);
    const tenantUsers = getData('tenantUsers', []);
    const managerUsers = getData('managerUsers', []);
    const accountantUsers = getData('accountantUsers', []);
    const found = landlordUsers.some(u => u.email.toLowerCase() === email.toLowerCase()) || 
                  tenantUsers.some(u => u.email.toLowerCase() === email.toLowerCase()) ||
                  managerUsers.some(u => u.email.toLowerCase() === email.toLowerCase()) ||
                  accountantUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
        showAlert(alertContainer, 'Email not found. Please check the address and try again.', 'danger');
        return;
    }
    showAlert(alertContainer, 'A password reset link has been sent to your email address (simulated).', 'success');
    document.getElementById('forgot-password-form').reset();
}

function initPage() {
    initLocalDefaults();
    const page = document.documentElement.dataset.page;
    if (page === 'home') {
        renderHomeMaterials();
        renderPropertyList();
        const purchaseForm = document.getElementById('purchase-form');
        if (purchaseForm) {
            purchaseForm.addEventListener('submit', submitPurchase);
        }
    }
    if (page === 'landlord') {
        renderLandlordPosts();
        document.getElementById('landlord-login-form').addEventListener('submit', landlordLogin);
        document.getElementById('landlord-post-form').addEventListener('submit', landlordPost);
    }
    if (page === 'tenant') {
        document.getElementById('tenant-signup-form').addEventListener('submit', tenantSignup);
        document.getElementById('tenant-login-form').addEventListener('submit', tenantSignin);
    }
    if (page === 'manager') {
        document.getElementById('manager-login-form').addEventListener('submit', managerLogin);
        document.getElementById('manager-signup-form').addEventListener('submit', managerSignup);
        document.getElementById('manager-signin-toggle').addEventListener('click', () => toggleManagerAuthTab('signin'));
        document.getElementById('manager-signup-toggle').addEventListener('click', () => toggleManagerAuthTab('signup'));
        const mediaForm = document.getElementById('manager-media-form');
        if (mediaForm) mediaForm.addEventListener('submit', postBuildingMedia);
        const reportForm = document.getElementById('manager-report-form');
        if (reportForm) reportForm.addEventListener('submit', submitManagerReport);
        const treasuryForm = document.getElementById('manager-treasury-form');
        if (treasuryForm) treasuryForm.addEventListener('submit', recordTreasuryTransaction);
    }
    if (page === 'accountant') {
        document.getElementById('accountant-login-form').addEventListener('submit', accountantLogin);
        document.getElementById('sales-form').addEventListener('submit', recordSale);
        document.getElementById('bill-form').addEventListener('submit', addBill);
    }
    if (page === 'forgot') {
        document.getElementById('forgot-password-form').addEventListener('submit', forgotPasswordReset);
    }
}

window.addEventListener('DOMContentLoaded', initPage);

