import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
})
export class AppComponent {
  rotate = true;

  energy = {
    nodes: [
      {
        id: 'energy',
        name: 'Energy',
      },
      {
        id: 'resource',
        name: 'Resource',
      },
      {
        id: 'cutting',
        name: 'Cutting',
      },
      {
        id: 'product1',
        name: 'Product1',
      },
      {
        id: 'product2',
        name: 'Product2',
      },
      {
        id: 'product3',
        name: 'Product3',
      },
      {
        id: 'packaging',
        name: 'Packaging',
      },
      {
        id: 'painting',
        name: 'Painting/Gluing',
      },
      {
        id: 'pressing',
        name: 'Steel Pressing',
      },
      {
        id: 'moulding',
        name: 'Injection Moulding',
      },
    ],
    links: [
      {
        source: 'energy',
        target: 'cutting',
        value: 30,
      },
      {
        source: 'energy',
        target: 'moulding',
        value: 15,
      },
      {
        source: 'energy',
        target: 'packaging',
        value: 15,
      },
      {
        source: 'energy',
        target: 'pressing',
        value: 20,
      },
      {
        source: 'energy',
        target: 'painting',
        value: 10,
      },
      {
        source: 'resource',
        target: 'cutting',
        value: 10,
      },
      {
        source: 'resource',
        target: 'moulding',
        value: 10,
      },
      {
        source: 'resource',
        target: 'pressing',
        value: 5,
      },
      {
        source: 'resource',
        target: 'painting',
        value: 10,
      },
      {
        source: 'cutting',
        target: 'product1',
        value: 20,
      },
      {
        source: 'cutting',
        target: 'product2',
        value: 20,
      },
      {
        source: 'moulding',
        target: 'product1',
        value: 10,
      },
      {
        source: 'moulding',
        target: 'product3',
        value: 15,
      },
      {
        source: 'packaging',
        target: 'product1',
        value: 3.75,
      },
      {
        source: 'packaging',
        target: 'product3',
        value: 3.75,
      },
      {
        source: 'packaging',
        target: 'product2',
        value: 7.5,
      },

      {
        source: 'pressing',
        target: 'product1',
        value: 5,
      },
      {
        source: 'pressing',
        target: 'product2',
        value: 20,
      },
      {
        source: 'painting',
        target: 'product1',
        value: 5,
      },
      {
        source: 'painting',
        target: 'product2',
        value: 10,
      },
      {
        source: 'painting',
        target: 'product3',
        value: 5,
      },
    ],
  };

  //sampleData = this.ONT;

  onFacilitySelect($event) {
    console.log('ON SELECT: ', $event);
  }

  onChange($event) {
    console.log('ON CHANGE: ', $event);
    // this.sampleData = this[$event.target.value];

    // console.log(this.sampleData);
  }
}
