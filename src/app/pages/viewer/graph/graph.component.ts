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
    console.log('eeee', value);
    if (value[1] && value[0]) {
      var month = Number(value[1].slice(0, 2));
      var year = Number(value[1].slice(3, 9));
      this.pieChartData = this.formatDataPieGraph(value[0]);
      this.barChartData = this.formatDataBarGraph(value[0], year, month);
    }
  }

  public pieChartData!: PieGraph;
  public barChartData!: BarGraph | undefined;

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
  public formatDataBarGraph(
    data: any,
    year: number,
    month: number
  ): BarGraph | undefined {
    console.log('srhtetrbs', data);
    let transformedData: { [key: string]: number[] } = {};

    const getDays = (year: number, month: number) => {
      return new Date(year, month, 0).getDate();
    };
    let nbrOfDay = getDays(year, month);

    data.forEach((e: { row_label: string }) => {
      transformedData[e.row_label] = Array(nbrOfDay).fill(0);
    });

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
    console.log(transformedData);
    var datasets: { label: string; data: number[] }[] = [];

    Object.keys(transformedData).forEach((element: string) => {
      datasets.push({
        label: element,
        data: transformedData[element],
      });
    });

    let dayList = [...Array(nbrOfDay).keys()];

    dayList = dayList.map((e) => e + 1);

    console.log({
      labels: dayList,
      datasets: datasets,
    });
    return {
      labels: dayList,
      datasets: datasets,
    };
  }
}
