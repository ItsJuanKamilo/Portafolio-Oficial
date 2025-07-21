import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2'; // ✅ Importa SweetAlert2

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact-form.html',
  styleUrls: ['./contact-form.scss']
})
export class ContactFormComponent {
  form = {
    name: '',
    email: '',
    message: ''
  };

  onSubmit(formDirective: NgForm) {
  const { name, email, message } = this.form;

  // Validación personalizada
  if (!name || !email || !message) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor, completá todos los campos del formulario.',
    });
    return;
  }

  // Validación de formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    Swal.fire({
      icon: 'error',
      title: 'Email inválido',
      text: 'Ingresá un correo electrónico válido.',
    });
    return;
  }

  // Construcción de datos
  const formData = {
    name,
    email,
    message,
    time: new Date().toLocaleString()
  };

  // Envío del correo
  Swal.fire({ title: 'Enviando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

  emailjs.send('service_ihwm66a', 'template_6jl6f0m', formData, '71M1_pUEk9R7ZRfcv')
    .then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Mensaje enviado',
        text: 'Tu mensaje fue enviado correctamente.',
      });
      formDirective.resetForm();
    })
    .catch((error) => {
      console.error('❌ Error al enviar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo enviar el mensaje. Intentalo más tarde.',
      });
    });
}
}
