export interface IRoute {
  path: string;
  component: () => JSX.Element | null;
}

export const routes: IRoute[] = [];
