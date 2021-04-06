import {Component, ViewEncapsulation, ElementRef, OnInit, AfterViewInit} from '@angular/core';
import { MapObject, VisitedCountries } from 'src/shared/map';
import { DomSanitizer } from '@angular/platform-browser';

declare const VERSION: string;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit, AfterViewInit {

  title = 'Version: ' + VERSION;
  domParser;
  pathObjects;

  hoverTitle = '';

  staticList = VisitedCountries;
  hyperlinkedList = [];

  constructor(private sanitizer: DomSanitizer, private elementRef: ElementRef) { }

  ngOnInit() {

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
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.querySelectorAll('.visited').forEach((el) => {
      el.addEventListener('mouseenter', (event) => {
        // highlight the mouseenter target
        this.hoverTitle = event.target.getAttribute('title');
      });
      el.addEventListener('mouseleave', (event) => {
        // highlight the mouseenter target
        this.hoverTitle = '';
      });
    });
  }

  getRandomCountry() {
    const country = this.staticList[Math.floor(Math.random() * this.staticList.length)];
    window.open(`https://www.veronicaspann.com/${country}`, '_blank');
  }

}
