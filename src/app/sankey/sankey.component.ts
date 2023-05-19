import {
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import { select as d3_select } from 'd3-selection';
import 'd3-transition';
import { easeQuadInOut as d3_easeQuadInOut } from 'd3-ease';
import { scaleOrdinal as d3_scaleOrdinal } from 'd3-scale';
import * as d3 from 'd3';

import {
  sankey as d3_sankey,
  sankeyLinkHorizontal as d3_sankeyLinkHorizontal,
  sankeyJustify as d3_sankeyJustify,
  sankeyLeft as d3_sankeyLeft,
  sankeyRight as d3_sankeyRight,
  sankeyCenter as d3_sankeyCenter,
} from 'd3-sankey';

//import { drag as d3_drag } from 'd3-drag';

const COLORS = [
  '#B70077',
  '#0384D4',
  '#EE6B0B',
  '#A319B1',
  '#11A611',
  '#1BB9FF',
  '#495A9C',
  '#EDB700',
  '#8B98C8',
  '#E6C49C',
  '#CCB8CE',
  '#9B9B9B',
];

@Component({
  selector: 'dataviz-sankey',
  template: ``,
})
export class DatavizSankeyComponent implements OnInit {
  @HostBinding('class.pbds-chart')
  chartClass = true;

  @HostBinding('class.pbds-chart-sankey')
  sankeyClass = true;

  @Input()
  data: any;

  @Input()
  width = 800;

  @Input()
  height = 600;

  // @Input()
  // rotate = true;

  private chart;
  private container;
  private margin;
  private svg;
  private sankey;
  private nodes;
  private links;
  private colors;

  constructor(private _element: ElementRef) {}

  ngOnInit() {
    // console.log('DATA: ', this.data);

    this.margin = { top: 10, right: 20, bottom: 10, left: 30 };

    this.chart = d3_select(this._element.nativeElement).attr(
      'aria-hidden',
      'true'
    );

    this.svg = this.chart
      .append('svg')
      .attr('class', 'img-fluid')
      .attr('preserveAspectRatio', 'xMinYMin meet');

    this.container = this.svg.append('g').attr('class', 'container');

    this.links = this.container.append('g').attr('class', 'links');
    this.nodes = this.container.append('g').attr('class', 'nodes');
    this.update();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.data && !changes.data.firstChange) {
      this.update();
    }
  }

  update() {
    this.svg
      .attr('width', this.width)
      .attr('height', this.height)
      .attr(
        'viewBox',
        `-${this.margin.left} -${this.margin.top} ${this.width} ${this.height}`
      );
    this.container.attr('transform', null);

    // set up colors
    const labels = new Set();
    this.data.nodes.map((d) => labels.add(d.id));
    //console.log(this.data.nodes);
    const labelsArray: any[] = Array.from(labels);
    //console.log(labelsArray);
    this.colors = d3_scaleOrdinal().domain(labelsArray).range(COLORS);
    // Set the sankey diagram properties

    var tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    this.sankey = d3_sankey()
      .nodeId((d: any) => d.id)
      .nodeWidth(10)
      .nodeAlign(d3_sankeyCenter)
      .nodePadding(0.5)
      .nodeSort(null)
      .size([
        this.width - this.margin.left - this.margin.right,
        this.height - this.margin.top - this.margin.bottom,
      ])
      .iterations(50);

    this.sankey(this.data);
    // LINKS
    // console.log('this consolde' + JSON.stringify(this.data[0]));
    this.links
      .attr('fill', 'none')
      .selectAll('path')
      .data(this.data.links)
      .join(
        (enter) => {
          return enter
            .append('path')
            .attr('d', d3_sankeyLinkHorizontal())
            .attr('stroke-width', (d) => d.width)
            .attr('stroke', (d) => {
              // return '#000';
              // console.log('STROKE: ', d, this.colors(d.id));
              return '#ccc';
            })
            .style('opacity', 1)
            .style('mix-blend-mode', 'multiply');
        },

        (update) =>
          update
            .transition()
            .duration(1000)
            .ease(d3_easeQuadInOut)
            .attr('d', d3_sankeyLinkHorizontal())
            .attr('stroke-width', (d) => d.width),

        (exit) => {
          return exit.remove();
        }
      )
      .append('title')
      .style('opacity', 0)
      .text(function (d: any) {
        return d.source.name + ' → ' + d.target.name + '\n' + d.value;
      })
      // .on('mouseenter', (event, data) => this.onMouseEnterLink(event, data))
      // .on('mouseleave', (event, data) => this.onMouseLeaveLink(event, data));

      // .on('mouseenter', (event, data) => {
      //   this.links.append('title').text(function (d: any) {
      //     return data.value;
      //   });
      // });

      // .on('mouseleave', (event, data) => {
      //   // this.links.append('title').style("opacity",0).text(function (d: any) {
      //   //   console.log("Removed");
      //   //   return "20";
      //   // });
      // });
      .on('mouseenter', (event, data) => {
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip
          .html(data.value)
          .style('left', d3.event.pageX + 'px')
          .style('top', d3.event.pageY + 'px');
      })
      .on('mouseleave', (event, data) => {
        tooltip.transition().duration(500).style('opacity', 0);
      });

    // NODES
    this.nodes
      .selectAll('rect')
      .data(this.data.nodes)
      .join(
        (enter) => {
          return enter
            .append('rect')
            .attr('x', (d) => d.x0)
            .attr('y', (d) => d.y0)
            .attr('height', (d) => d.y1 - d.y0)
            .attr('width', (d) => this.sankey.nodeWidth())
            .attr('fill', (d, i) => {
              // console.log('FILL: ', d, this.colors(d.id));
              return this.colors(d.id);
            });
        },
        (update) => {
          return update
            .transition()
            .duration(1000)
            .ease(d3_easeQuadInOut)
            .attr('x', (d) => d.x0)
            .attr('y', (d) => d.y0)
            .attr('height', (d) => d.y1 - d.y0)
            .attr('width', (d) => this.sankey.nodeWidth());
        },
        (exit) => {
          return exit.remove();
        }
      )
      .append('title')
      .text(function (d: any) {
        return d.name + '\n' + d.value;
      })
      .on('mouseenter', (event, data) => console.log(data));
    // NODE TEXT
    this.nodes
      .selectAll('text')
      .data(this.data.nodes)
      .join(
        (enter) =>
          enter
            .append('text')
            .text((d) => `${d.name}`)
            .style('fill', '#000')
            .attr('text-anchor', 'middle')
            .attr('font-family', 'sans-serif')
            .attr('font-size', 14)
            //.attr('font-weight', 'bold')
            .attr('x', (d, i) => {
              return d.x0 + (d.x1 - d.x0) / 2;
            })
            .attr('y', (d, i) => {
              return d.y0 + (d.y1 - d.y0) / 2;
            })
            .attr('dy', '-1.35em')
            //.attr('dx','2.5em')
            .attr('transform', (d, i) => {
              const x = d.x0 + (d.x1 - d.x0) / 2;
              const y = d.y0 + (d.y1 - d.y0) / 2;
              return `rotate(270, ${x}, ${y})`;
            }),
        (update) =>
          update
            .transition()
            .duration(1000)
            .ease(d3_easeQuadInOut)
            .attr('x', (d, i) => {
              return d.x0 + (d.x1 - d.x0) / 2;
            })
            .attr('y', (d, i) => {
              return d.y0 + (d.y1 - d.y0) / 2;
            })
            .attr('transform', (d, i) => {
              const x = d.x0 + (d.x1 - d.x0) / 2;
              const y = d.y0 + (d.y1 - d.y0) / 2;
              return `rotate(270, ${x}, ${y})`;
            })
      );
  }

  onMouseEnterLink(event, data) {
    const element = d3_select(event.target);
    // this.links.selectAll('path').style('opacity', 0.2);
    // element.style('opacity', 1).style('mix-blend-mode', null);
  }

  onMouseLeaveLink(event, data) {
    //this.links.selectAll('path').style('opacity', 0.3);
  }

  dragmove(event, data) {
    // console.log(event, data);
    // d3_select(event)
    //   .attr("transform",
    //         "translate("
    //            + event.x + ","
    //            + (event.y = Math.max(
    //               0, Math.min(height - event.dy, d3.event.y))
    //              ) + ")");
    // sankey.relayout();
    // link.attr("d", path);
  }
}
