import { Component, Input } from '@angular/core';

type PieGraph = {
  labels: string[];
  datasets: [
    { data: number[]; backgroundColor?: any[]; hoverBackgroundColor?: any[] }
  ];
};

type BarGraph = {
  labels: number[];
  datasets: { label: string; data: number[] }[];
};

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrl: './graph.component.scss',
})
export class GraphComponent {
  @Input() set data(value: any) {
    this.pieChartData = this.formatDataPieGraph(value);
    this.barChartData = this.formatDataBarGraph(value);
  }

  public pieChartData!: PieGraph;
  public barChartData!: BarGraph;

  public formatDataPieGraph(data: any): PieGraph {
    let transformedData = {};

    data.map(
      (e: {
        row_label: string;
        duration_in_hours: string;
        day_of_month: number;
      }) => {
        if (!Object.keys(transformedData).includes(e.row_label)) {
          (transformedData[e.row_label as keyof typeof transformedData] as {
            duration_in_hours: string;
            day_of_month: number;
          }[]) = [] as {
            duration_in_hours: string;
            day_of_month: number;
          }[];
        }

        (
          transformedData[
            e.row_label as keyof typeof transformedData
          ] as number[]
        ).push(Number(e.duration_in_hours));
      }
    );

    var dataGraph: number[] = [];

    var dataGraphTempo: number[][] = Object.values(transformedData);
    for (let index = 0; index < dataGraphTempo.length; index++) {
      dataGraph.push(
        dataGraphTempo[index].reduce((partialSum, a) => partialSum + a, 0)
      );
    }
    return {
      labels: Object.keys(transformedData),
      datasets: [{ data: dataGraph }],
    };
  }
  public formatDataBarGraph(data: any): BarGraph {
    console.log('eeedde', data);
    let transformedData: { [key: string]: number[] } = {};

    // Initialize transformedData with arrays of 31 zeros for each row_label
    data.forEach((e: { row_label: string }) => {
      transformedData[e.row_label] = Array(31).fill(0);
    });

    // Fill in actual data where available
    data.forEach(
      (e: {
        row_label: string;
        duration_in_hours: string;
        day_of_month: number;
      }) => {
        transformedData[e.row_label][e.day_of_month - 1] = Number(
          e.duration_in_hours
        );
      }
    );

    var datasets: { label: string; data: number[] }[] = [];

    Object.keys(transformedData).forEach((element: string) => {
      datasets.push({
        label: element,
        data: transformedData[element],
      });
    });

    console.log('eeedde', {
      labels: [...Array(31).keys()],
      datasets: datasets,
    });
    return {
      labels: [...Array(31).keys()],
      datasets: datasets,
    };
  }
}
