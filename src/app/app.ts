import { Component, OnInit, signal } from '@angular/core';
import { ContactFormComponent } from './contact-form/contact-form';
import { CommonModule } from '@angular/common';
import axios from 'axios';

interface GitHubRepo {
  name: string;
  html_url: string;
  readme: string;  // Esta propiedad se añadirá cuando descarguemos el README
  imgUrl?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ContactFormComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent implements OnInit {
  readonly title = signal('mi-portafolio');
  menuOpen = signal(false);

  texts = ['FULLSTACK', 'FRONT END', 'BACK END', 'DESARROLLADOR'];
  displayedText = '';
  private currentWord = 0;
  private currentIndex = 0;

  repos: GitHubRepo[] = [];
  loading = true;

  ngOnInit() {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    this.type();
    this.fetchGitHubRepos(); // Llamada a la API de GitHub para cargar los repos
    setTimeout(() => window.scrollTo(0, 0), 0); // Fuerza el scroll al inicio después de renderizar
  }

  toggleMenu() {
    this.menuOpen.update(o => !o);
  }

  private type() {
    const word = this.texts[this.currentWord];
    if (this.currentIndex < word.length) {
      this.displayedText += word[this.currentIndex++];
      setTimeout(() => this.type(), 150);
    } else {
      setTimeout(() => this.erase(), 1000);
    }
  }

  private erase() {
    if (this.currentIndex > 0) {
      this.displayedText = this.displayedText.slice(0, -1);
      this.currentIndex--;
      setTimeout(() => this.erase(), 100);
    } else {
      this.currentWord = (this.currentWord + 1) % this.texts.length;
      setTimeout(() => this.type(), 200);
    }
  }

  private fetchGitHubRepos() {
    const githubApiUrl = 'https://api.github.com/users/ItsJuanKamilo/repos';

    axios.get(githubApiUrl)
      .then(response => {
        const repos = response.data;
        // Filtrar el repositorio que no quieres mostrar
        const exclude = ['ItsJuanKamilo', 'Portafolio-Oficial'];
        this.repos = repos.filter((repo: GitHubRepo) => !exclude.includes(repo.name));

        // Obtener el contenido del README y la imagen de cada repositorio
        this.repos.forEach(repo => {
          const imgUrl = `https://raw.githubusercontent.com/ItsJuanKamilo/${repo.name}/main/img.png`;

          // Verificar si la imagen existe
          axios.get(imgUrl, { responseType: 'blob' })
            .then(() => {
              // Si la imagen existe, asignar la URL
              repo.imgUrl = imgUrl;
            })
            .catch(() => {
              // Si no existe, asignar undefined para que no se renderice nada
              repo.imgUrl = undefined;  // Usar undefined en lugar de null
            });

          // Obtener el contenido del README
          axios.get(`https://raw.githubusercontent.com/ItsJuanKamilo/${repo.name}/main/README.md`)
            .then(readmeResponse => {
              repo.readme = readmeResponse.data;  // Almacenar el contenido del README
            })
            .catch(err => {
              repo.readme = "No README disponible";
            });
        });

        this.loading = false;
      })
      .catch(err => {
        console.error("Error al obtener los repositorios", err);
        this.loading = false;
      });
  }
}
