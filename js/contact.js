document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Form verilerini al
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Burada form verilerini backend'e gönderme işlemi yapılacak
        console.log('Form verileri:', data);

        // Başarılı gönderim mesajı
        alert('Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.');
        
        // Formu temizle
        contactForm.reset();
    });
}); 