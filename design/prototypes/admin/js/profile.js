/* 个人资料页面专用JavaScript */

// 页面数据
const profileData = {
    user: {
        name: '用户名',
        address: '0x1234567890abcdef1234567890abcdef12345678',
        email: 'user@example.com',
        phone: '+86 138****8888',
        registeredAt: '2024-01-15 10:30:00',
        uniqueId: 'UID_123456789',
        gender: null,
        birthday: null,
        isVerified: true,
        role: 'user', // 'user' 或 'admin'
        status: '账户状态正常',
        kycStatus: 'not-verified' // 'not-verified', 'in-progress', 'verified'
    },
    activities: [
        {
            id: 1,
            type: 'purchase',
            title: '购买商品 "数字艺术品#3721"',
            description: '交易哈希: 0xabc...123',
            time: '2024-05-20 14:30',
            status: 'completed',
            icon: 'fas fa-shopping-cart'
        },
        {
            id: 2,
            type: 'deposit',
            title: '充值 1.5 ETH',
            description: '交易哈希: 0xdef...456',
            time: '2024-05-18 09:45',
            status: 'completed',
            icon: 'fas fa-wallet'
        },
        {
            id: 3,
            type: 'profile',
            title: '更新个人信息',
            description: '修改了邮箱和手机号',
            time: '2024-05-15 16:20',
            status: 'system',
            icon: 'fas fa-user-edit'
        }
    ]
};

// KYC认证流程数据
const kycData = {
    currentStep: 1,
    totalSteps: 4,
    steps: [
        {
            id: 1,
            title: '填写基本信息',
            description: '提供您的真实姓名、身份证号等基本信息',
            formId: 'kycForm1'
        },
        {
            id: 2,
            title: '上传身份证照片',
            description: '上传您的身份证正反面清晰照片',
            formId: 'kycForm2'
        },
        {
            id: 3,
            title: '人脸验证',
            description: '完成在线人脸验证，确保身份真实性',
            formId: 'kycForm3'
        },
        {
            id: 4,
            title: '等待审核',
            description: '我们将在1-3个工作日内完成审核',
            formId: 'kycForm4'
        }
    ]
};

// 个人中心页面对象
const ProfilePage = {
    // 初始化
    init: function() {
        this.setupEventListeners();
        this.loadUserData();
    },
    
    // 设置事件监听器
    setupEventListeners: function() {
        // 复制钱包地址
        const copyAddressBtn = document.getElementById('copyAddressBtn');
        if (copyAddressBtn) {
            copyAddressBtn.addEventListener('click', this.handleCopyAddress);
        }
        
        // 所有编辑按钮
        const editButtons = document.querySelectorAll('.admin-btn-outline');
        editButtons.forEach(btn => {
            if (btn.textContent.includes('编辑') || btn.textContent.includes('修改')) {
                btn.addEventListener('click', this.handleEditField.bind(this));
            } else if (btn.textContent.includes('设置')) {
                btn.addEventListener('click', this.handleSetField.bind(this));
            }
        });
        
        // 开始KYC认证按钮
        const startKycBtns = document.querySelectorAll('#startKycBtn, #startKycBtn2');
        startKycBtns.forEach(btn => {
            btn.addEventListener('click', this.handleStartKyc.bind(this));
        });
        
        // 关闭KYC模态框按钮
        const closeKycModalBtn = document.getElementById('closeKycModal');
        if (closeKycModalBtn) {
            closeKycModalBtn.addEventListener('click', this.closeKycModal);
        }
        
        // KYC模态框下一步按钮
        const nextStepBtn = document.getElementById('nextStepBtn');
        if (nextStepBtn) {
            nextStepBtn.addEventListener('click', this.handleNextStep.bind(this));
        }
        
        // KYC模态框上一步按钮
        const prevStepBtn = document.getElementById('prevStepBtn');
        if (prevStepBtn) {
            prevStepBtn.addEventListener('click', this.handlePrevStep.bind(this));
        }
        
        // KYC模态框完成按钮
        const completeKycBtn = document.getElementById('completeKycBtn');
        if (completeKycBtn) {
            completeKycBtn.addEventListener('click', this.handleCompleteKyc.bind(this));
        }
        
        // 开始人脸验证按钮
        const startFaceVerifyBtn = document.getElementById('startFaceVerify');
        if (startFaceVerifyBtn) {
            startFaceVerifyBtn.addEventListener('click', this.handleFaceVerify.bind(this));
        }
        
        // 头像上传按钮
        const uploadButton = document.querySelector('.admin-upload-button');
        if (uploadButton) {
            uploadButton.addEventListener('click', this.handleAvatarUpload.bind(this));
        }
        
        // 设置开关监听器
        this.setupToggleSwitches();
        
        // 设置文件上传区域事件
        this.setupUploadAreas();
    },
    
    // 设置开关监听器
    setupToggleSwitches: function() {
        const toggles = document.querySelectorAll('.admin-toggle-switch input');
        toggles.forEach(toggle => {
            toggle.addEventListener('change', this.handleToggleChange.bind(this));
        });
    },
    
    // 处理开关变化
    handleToggleChange: function(e) {
        const toggleId = e.target.id;
        const isChecked = e.target.checked;
        
        console.log(`🔄 开关 ${toggleId} 状态: ${isChecked ? '开启' : '关闭'}`);
        
        // 显示操作反馈
        this.showToast(`${this.getToggleLabel(toggleId)}已${isChecked ? '开启' : '关闭'}`, 'success');
        
        // 这里可以添加实际的API调用
        // await this.updateUserSetting(toggleId, isChecked);
    },
    
    // 获取开关标签
    getToggleLabel: function(toggleId) {
        const labels = {
            'profilePublic': '个人资料公开',
            'marketingEmails': '营销邮件',
            'transactionNotifications': '交易通知'
        };
        return labels[toggleId] || '设置';
    },
    
    // 处理编辑字段
    handleEditField: function(e) {
        const button = e.target.closest('button');
        const item = button.closest('.admin-item');
        const fieldName = item.querySelector('.admin-item-info h4').textContent;
        
        console.log(`✏️ 编辑字段: ${fieldName}`);
        this.showToast(`正在编辑${fieldName}...`, 'info');
        
        // 这里可以添加实际的编辑逻辑
        // 比如弹出编辑对话框或跳转到编辑页面
    },
    
    // 处理设置字段
    handleSetField: function(e) {
        const button = e.target.closest('button');
        const item = button.closest('.admin-item');
        const fieldName = item.querySelector('.admin-item-info h4').textContent;
        
        console.log(`⚙️ 设置字段: ${fieldName}`);
        this.showToast(`正在设置${fieldName}...`, 'info');
        
        // 这里可以添加实际的设置逻辑
    },
    
    // 显示提示消息
    showToast: function(message, type = 'info') {
        // 创建提示元素
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${this.getToastIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // 添加样式
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getToastColor(type)};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        // 显示动画
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // 自动隐藏
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    },
    
    // 获取提示图标
    getToastIcon: function(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    },
    
    // 获取提示颜色
    getToastColor: function(type) {
        const colors = {
            'success': '#10b981',
            'error': '#ef4444',
            'warning': '#f59e0b',
            'info': '#3b82f6'
        };
        return colors[type] || '#3b82f6';
    },
    
    // 设置文件上传区域事件
    setupUploadAreas: function() {
        const uploadAreas = document.querySelectorAll('.upload-area');
        uploadAreas.forEach(area => {
            // 修改点击事件，确保只在非input元素上触发
            area.addEventListener('click', function(e) {
                // 防止点击input元素时再次触发文件选择
                if (e.target.tagName.toLowerCase() === 'input') {
                    return;
                }
                
                const fileInput = this.querySelector('.file-input');
                if (fileInput) {
                    fileInput.click();
                }
            });
            
            const fileInput = area.querySelector('.file-input');
            if (fileInput) {
                fileInput.addEventListener('change', function() {
                    if (this.files && this.files[0]) {
                        const parent = this.closest('.upload-area');
                        if (parent) {
                            // 更新上传区域显示
                            const icon = parent.querySelector('i');
                            const text = parent.querySelector('p');
                            const previewContainer = parent.querySelector('.preview-container');
                            const previewImage = parent.querySelector('.preview-image');
                            
                            if (icon) icon.className = 'fas fa-check-circle';
                            if (text) text.textContent = '已选择文件: ' + this.files[0].name;
                            
                            parent.style.borderColor = '#10b981';
                            if (icon) icon.style.color = '#10b981';
                            
                            // 显示图片预览
                            if (previewContainer && previewImage) {
                                const reader = new FileReader();
                                reader.onload = function(e) {
                                    previewImage.src = e.target.result;
                                    previewContainer.style.display = 'block';
                                };
                                reader.readAsDataURL(this.files[0]);
                            }
                        }
                    }
                });
                
                // 阻止input的点击事件冒泡，防止重复触发
                fileInput.addEventListener('click', function(e) {
                    e.stopPropagation();
                });
            }
            
            // 添加拖放功能
            area.addEventListener('dragover', function(e) {
                e.preventDefault();
                e.stopPropagation();
                this.style.borderColor = '#3b82f6';
                this.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
            });
            
            area.addEventListener('dragleave', function(e) {
                e.preventDefault();
                e.stopPropagation();
                this.style.borderColor = '';
                this.style.backgroundColor = '';
            });
            
            area.addEventListener('drop', function(e) {
                e.preventDefault();
                e.stopPropagation();
                this.style.borderColor = '';
                this.style.backgroundColor = '';
                
                const fileInput = this.querySelector('.file-input');
                if (fileInput && e.dataTransfer.files.length > 0) {
                    fileInput.files = e.dataTransfer.files;
                    
                    // 触发change事件
                    const event = new Event('change', { bubbles: true });
                    fileInput.dispatchEvent(event);
                }
            });
        });
    },
    
    // 复制钱包地址
    handleCopyAddress: function() {
        const addressElement = document.querySelector('.admin-address-value');
        if (addressElement) {
            const address = profileData.user.address;
            
            // 使用现代 Clipboard API
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(address).then(() => {
                    console.log('✅ 钱包地址已复制到剪贴板');
                    ProfilePage.showToast('钱包地址已复制', 'success');
                }).catch(err => {
                    console.error('❌ 复制失败:', err);
                    ProfilePage.showToast('复制失败，请手动复制', 'error');
                });
            } else {
                // 降级方案：使用传统方法
                const textArea = document.createElement('textarea');
                textArea.value = address;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    console.log('✅ 钱包地址已复制到剪贴板（降级方案）');
                    ProfilePage.showToast('钱包地址已复制', 'success');
                } catch (err) {
                    console.error('❌ 复制失败:', err);
                    ProfilePage.showToast('复制失败，请手动复制', 'error');
                }
                document.body.removeChild(textArea);
            }
        }
    },
    
    // 头像上传处理
    handleAvatarUpload: function() {
        console.log('📷 头像上传功能');
        this.showToast('头像上传功能开发中...', 'info');
    },
    
    // 开始KYC认证
    handleStartKyc: function() {
        console.log('🛡️ 开始KYC认证');
        const modal = document.getElementById('kycModal');
        if (modal) {
            modal.classList.add('active');
            this.resetKycModal();
        }
    },
    
    // 关闭KYC模态框
    closeKycModal: function() {
        const modal = document.getElementById('kycModal');
        if (modal) {
            modal.classList.remove('active');
        }
    },
    
    // 重置KYC模态框
    resetKycModal: function() {
        kycData.currentStep = 1;
        this.updateKycSteps();
        this.showKycForm(1);
        this.updateKycButtons();
    },
    
    // 更新KYC步骤显示
    updateKycSteps: function() {
        const steps = document.querySelectorAll('.step');
        steps.forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNumber < kycData.currentStep) {
                step.classList.add('completed');
            } else if (stepNumber === kycData.currentStep) {
                step.classList.add('active');
            }
        });
    },
    
    // 显示KYC表单
    showKycForm: function(stepNumber) {
        // 隐藏所有表单
        for (let i = 1; i <= kycData.totalSteps; i++) {
            const form = document.getElementById(`kycForm${i}`);
            if (form) {
                form.style.display = 'none';
            }
        }
        
        // 显示当前步骤的表单
        const currentForm = document.getElementById(`kycForm${stepNumber}`);
        if (currentForm) {
            currentForm.style.display = 'block';
        }
    },
    
    // 更新KYC按钮状态
    updateKycButtons: function() {
        const prevBtn = document.getElementById('prevStepBtn');
        const nextBtn = document.getElementById('nextStepBtn');
        const completeBtn = document.getElementById('completeKycBtn');
        
        if (prevBtn) {
            prevBtn.style.display = kycData.currentStep > 1 ? 'inline-flex' : 'none';
        }
        
        if (nextBtn) {
            nextBtn.style.display = kycData.currentStep < kycData.totalSteps ? 'inline-flex' : 'none';
        }
        
        if (completeBtn) {
            completeBtn.style.display = kycData.currentStep === kycData.totalSteps ? 'inline-flex' : 'none';
        }
    },
    
    // KYC下一步
    handleNextStep: function() {
        if (kycData.currentStep < kycData.totalSteps) {
            kycData.currentStep++;
            this.updateKycSteps();
            this.showKycForm(kycData.currentStep);
            this.updateKycButtons();
            
            console.log(`📋 KYC步骤: ${kycData.currentStep}/${kycData.totalSteps}`);
        }
    },
    
    // KYC上一步
    handlePrevStep: function() {
        if (kycData.currentStep > 1) {
            kycData.currentStep--;
            this.updateKycSteps();
            this.showKycForm(kycData.currentStep);
            this.updateKycButtons();
            
            console.log(`📋 KYC步骤: ${kycData.currentStep}/${kycData.totalSteps}`);
        }
    },
    
    // 完成KYC认证
    handleCompleteKyc: function() {
        console.log('✅ KYC认证完成');
        this.showToast('KYC认证申请已提交，请等待审核', 'success');
        
        // 更新KYC状态
        profileData.user.kycStatus = 'in-progress';
        this.updateKycStatus();
        
        // 关闭模态框
        setTimeout(() => {
            this.closeKycModal();
        }, 1500);
    },
    
    // 人脸验证
    handleFaceVerify: function() {
        console.log('📷 开始人脸验证');
        this.showToast('人脸验证功能开发中...', 'info');
        
        // 模拟验证过程
        setTimeout(() => {
            this.showToast('人脸验证完成', 'success');
        }, 2000);
    },
    
    // 更新KYC状态显示
    updateKycStatus: function() {
        const kycStatusElements = document.querySelectorAll('#kycStatus, .kyc-status.not-verified');
        kycStatusElements.forEach(element => {
            if (profileData.user.kycStatus === 'in-progress') {
                element.className = 'kyc-status in-progress';
                element.innerHTML = '<i class="fas fa-clock"></i> 审核中';
            } else if (profileData.user.kycStatus === 'verified') {
                element.className = 'kyc-status verified';
                element.innerHTML = '<i class="fas fa-check-circle"></i> 已认证';
            }
        });
    },
    
    // 加载用户数据
    loadUserData: function() {
        console.log('📊 加载用户数据');
        // 这里可以从API加载实际的用户数据
        // const userData = await fetchUserData();
        // profileData.user = userData;
        
        // 更新页面显示
        this.updateUserDisplay();
    },
    
    // 更新用户显示
    updateUserDisplay: function() {
        // 更新用户名
        const userNameElement = document.querySelector('.admin-user-name');
        if (userNameElement) {
            userNameElement.childNodes[0].textContent = profileData.user.name;
        }
        
        // 更新钱包地址
        const addressElement = document.querySelector('.admin-address-value');
        if (addressElement) {
            addressElement.textContent = this.formatAddress(profileData.user.address);
        }
        
        // 更新其他信息...
        console.log('✅ 用户显示更新完成');
    },
    
    // 格式化地址显示
    formatAddress: function(address) {
        if (!address) return '';
        return address.slice(0, 6) + '...' + address.slice(-4);
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    ProfilePage.init();
    console.log('✅ 个人信息页面初始化完成');
});
