import { Component, ViewEncapsulation, ElementRef } from '@angular/core';
import { MapObject, VisitedCountries } from 'src/shared/map';
import { DomSanitizer } from '@angular/platform-browser';

declare const VERSION: string;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {

  title = 'Version: ' + VERSION;
  domParser;
  pathObjects;

  staticList = VisitedCountries;

  constructor(private sanitizer: DomSanitizer, private elementRef: ElementRef) { }

  ngOnInit() {

    this.domParser = new DOMParser();

    const parsedHtml = this.domParser.parseFromString(MapObject.paths, "text/html");
    const pathTags = parsedHtml.getElementsByTagName("path");
    const elementsAsStrings = [];

    Array.from(pathTags).forEach((element: any) => {

      const hyphenatedCountry = element.title.toLowerCase().replace(/\ /g, '-');

      if (this.staticList.includes(hyphenatedCountry)) {
        element.className = "visited"
        elementsAsStrings.push(`<a href="https://www.veronicaspann.com/${hyphenatedCountry}" target="_blank">${element.outerHTML}</a>`);
      } else {
        element.className = "not-visited"
        elementsAsStrings.push(element.outerHTML);
      }
    
    });
    
    this.pathObjects = this.sanitizer.bypassSecurityTrustHtml(elementsAsStrings.join());
  
  }

}
