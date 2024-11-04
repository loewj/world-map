import { Component, ViewEncapsulation, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { MapObject } from 'src/shared/map';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

declare const VERSION: string;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {

  title = 'Version: ';
  domParser;
  pathObjects;

  hoverTitle = '';

  staticList = [];
  hyperlinkedList = [];

  constructor(
    private sanitizer: DomSanitizer,
    private elementRef: ElementRef,
    private http: HttpClient
  ) { }

  ngOnInit() {
    // Fetch remote JSON data
    this.fetchVisitedCountries().subscribe((data: string[]) => {
      this.staticList = data;
      this.staticList.sort();

      this.hyperlinkedList = this.staticList.map(el => {
        return {
          countryName: el.replace(/-/g, ' '),
          hyperlink: `https://www.veronicaspann.com/${el}`
        };
      });

      this.domParser = new DOMParser();
      const parsedHtml = this.domParser.parseFromString(MapObject.paths, 'text/html');
      const pathTags = parsedHtml.getElementsByTagName('path');
      const elementsAsStrings = [];

      Array.from(pathTags).forEach((element: any) => {
        const hyphenatedCountry = element.title.toLowerCase().replace(/ /g, '-');

        if (this.staticList.includes(hyphenatedCountry)) {
          element.className = 'visited';
          elementsAsStrings.push(`<a href="https://www.veronicaspann.com/${hyphenatedCountry}" target="_blank">${element.outerHTML}</a>`);
        } else {
          element.className = 'not-visited';
          elementsAsStrings.push(element.outerHTML);
        }
      });
      this.pathObjects = this.sanitizer.bypassSecurityTrustHtml(elementsAsStrings.join());

      // Add event listeners to the 'visited' elements
      setTimeout(() => {
        this.elementRef.nativeElement.querySelectorAll('.visited').forEach((el) => {
          el.addEventListener('mouseenter', (event) => {
            this.hoverTitle = event.target.getAttribute('title');
          });
          el.addEventListener('mouseleave', () => {
            this.hoverTitle = '';
          });
        });
      });
    });
  }

  getRandomCountry() {
    const country = this.staticList[Math.floor(Math.random() * this.staticList.length)];
    window.open(`https://www.veronicaspann.com/${country}`, '_blank');
  }

  // Helper method to fetch data
  private fetchVisitedCountries(): Observable<string[]> {
    return this.http.get<string[]>('https://veronicaspannphotography.s3.us-east-1.amazonaws.com/visited-countries.json');
  }
}