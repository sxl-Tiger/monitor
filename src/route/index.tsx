import {
  createBrowserRouter,
  Navigate,
} from "react-router-dom";

const routes = createBrowserRouter([
  {
    // 访问根路径就会重定向到 /home
    path: '/',
    element: <Navigate to="/project" />,
  },
  {
    path: "/",
    lazy: async () => ({
      Component: (await import('../App')).default,
    }),
    children: [
      { 
        path: "project", 
        lazy: async () => ({
          Component: (await import('../pages/Project/index')).default,
        })
      },
      { 
        path: "project/detail", 
        lazy: async () => ({
          Component: (await import('../pages/Project/Detail')).default,
        })
      },
      { 
        path: "monitor", 
        lazy: async () => ({
          Component: (await import('../pages/Monitor')).default,
        })
      },
      { 
        path: "monitor/detail", 
        lazy: async () => ({
          Component: (await import('../pages/Monitor/Detail')).default,
        })
      },
      { 
        path: "detail", 
        lazy: async () => ({
          Component: (await import('../pages/Detail')).default,
        })
      },
    ]
  }
])

export default routes;