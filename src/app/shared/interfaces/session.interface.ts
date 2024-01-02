export interface session {
  id: number,
  timestampStart: number,
  timestampEnd?: number,
  loginUser: string,
  idProject: number
}
