namespace API {
  export interface IBaseResponse {
    code: number;
    msg: string;
    success: boolean;
  }

  export interface IProjectRes extends IBaseResponse {
    data: {
      id: number;
      name: string;
      owner: string;
      monitorCount: number;
    }[];
  }
  export interface  coedeRes extends IBaseResponse{
    data:{
      code: number;
      name: string;
      projectId: number;
    }[]
  }
}