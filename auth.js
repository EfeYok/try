// Bellekte veri saklama
let usersData = {};
let adminsData = {};
let currentSessionUser = null;

// Veri yönetimi fonksiyonları
function initUserData() {
    // localStorage'dan veri yükle
    try {
        const savedUsers = localStorage.getItem('kullanicilar');
        const savedAdmins = localStorage.getItem('adminler');
        const savedSession = sessionStorage.getItem('aktifKullanici');
        
        if (savedUsers) {
            usersData = JSON.parse(savedUsers);
        } else {
            // İlk kullanım için varsayılan admin hesabı
            usersData = { 'admin': '1234' };
            saveUsers();
        }
        
        if (savedAdmins) {
            adminsData = JSON.parse(savedAdmins);
        } else {
            // Admin hesabına yetki ver
            adminsData = { 'admin': true };
            saveAdmins();
        }
        
        if (savedSession) {
            currentSessionUser = savedSession;
        }
    } catch (e) {
        console.error('Veri yükleme hatası:', e);
    }
}

function saveUsers() {
    try {
        localStorage.setItem('kullanicilar', JSON.stringify(usersData));
    } catch (e) {
        console.error('Kullanıcı kaydetme hatası:', e);
    }
}

function saveAdmins() {
    try {
        localStorage.setItem('adminler', JSON.stringify(adminsData));
    } catch (e) {
        console.error('Admin kaydetme hatası:', e);
    }
}

function saveSession(username) {
    try {
        sessionStorage.setItem('aktifKullanici', username);
        currentSessionUser = username;
    } catch (e) {
        console.error('Oturum kaydetme hatası:', e);
    }
}

function clearSession() {
    try {
        sessionStorage.removeItem('aktifKullanici');
        currentSessionUser = null;
    } catch (e) {
        console.error('Oturum temizleme hatası:', e);
    }
}

// Kullanıcı işlemleri
function registerUser(username, password) {
    if (usersData[username]) {
        return { success: false, message: 'Bu kullanıcı adı zaten kullanılıyor!' };
    }
    
    usersData[username] = password;
    saveUsers();
    return { success: true, message: 'Kayıt başarılı!' };
}

function loginUser(username, password) {
    if (usersData[username] && usersData[username] === password) {
        return { success: true, message: 'Giriş başarılı!' };
    }
    return { success: false, message: 'Kullanıcı adı veya şifre hatalı!' };
}

function updateUsername(oldName, newName) {
    if (usersData[newName] && newName !== oldName) {
        return { success: false, message: 'Bu kullanıcı adı zaten kullanılıyor!' };
    }
    
    const password = usersData[oldName];
    const isAdmin = adminsData[oldName];
    
    delete usersData[oldName];
    usersData[newName] = password;
    
    if (isAdmin) {
        delete adminsData[oldName];
        adminsData[newName] = true;
        saveAdmins();
    }
    
    saveUsers();
    return { success: true, message: 'Kullanıcı adı güncellendi!' };
}

function updatePassword(username, newPassword) {
    usersData[username] = newPassword;
    saveUsers();
    return { success: true, message: 'Şifre güncellendi!' };
}

function deleteUser(username) {
    if (username === 'admin') {
        return { success: false, message: 'Admin hesabı silinemez!' };
    }
    
    delete usersData[username];
    delete adminsData[username];
    saveUsers();
    saveAdmins();
    return { success: true, message: 'Kullanıcı silindi!' };
}

// Admin yetki işlemleri
function giveAdminPermission(username) {
    if (!usersData[username]) {
        return { success: false, message: 'Kullanıcı bulunamadı!' };
    }
    
    adminsData[username] = true;
    saveAdmins();
    return { success: true, message: 'Admin yetkisi verildi!' };
}

function removeAdminPermission(username) {
    if (username === 'admin') {
        return { success: false, message: 'Ana admin yetkisi alınamaz!' };
    }
    
    delete adminsData[username];
    saveAdmins();
    return { success: true, message: 'Admin yetkisi alındı!' };
}

function checkIsAdmin(username) {
    return adminsData[username] === true;
}

function getAllUsers() {
    return Object.keys(usersData).map(username => ({
        username: username,
        isAdmin: checkIsAdmin(username)
    }));
}

// Oturum işlemleri
function setCurrentUser(username) {
    saveSession(username);
}

function getCurrentUser() {
    return currentSessionUser;
}

function logout() {
    clearSession();
}