// 平台概览页面JavaScript函数
console.log('Dashboard loaded');
function navigateToUserManagement() { if (window.parent && window.parent.loadPage) { window.parent.loadPage('admin-demo.html', '用户管理', 'fas fa-users'); } }
function navigateToOrderManagement() { if (window.parent && window.parent.loadPage) { window.parent.loadPage('admin-orders.html', '订单管理', 'fas fa-shopping-bag'); } }
function navigateToContractManagement() { if (window.parent && window.parent.loadPage) { window.parent.loadPage('smart-contracts.html', '智能合约', 'fas fa-file-contract'); } }
function navigateToGovernance() { if (window.parent && window.parent.loadPage) { window.parent.loadPage('governance-monitor.html', '治理监控', 'fas fa-vote-yea'); } }
function navigateToSystemSettings() { if (window.parent && window.parent.loadPage) { window.parent.loadPage('system-settings.html', '系统设置', 'fas fa-cog'); } }
function navigateToAnalytics() { if (window.parent && window.parent.loadPage) { window.parent.loadPage('analytics.html', '数据分析', 'fas fa-chart-bar'); } }
function refreshDashboard() { console.log('刷新数据'); alert('数据刷新功能'); }
function exportDashboard() { console.log('导出报告'); alert('导出报告功能'); }
function viewAllTransactions() { navigateToOrderManagement(); }
function viewAllAlerts() { console.log('查看所有告警'); alert('查看所有告警功能'); }
function viewUserAnalytics() { navigateToAnalytics(); }
function handleAlert(type) { console.log('处理告警:', type); alert('告警处理功能'); }
console.log(' 所有函数已定义完成');
