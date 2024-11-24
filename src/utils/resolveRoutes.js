const resolveRoutes = (route) => {
  let hasID = route.includes("?");
  if (hasID) {
    return `/${route.split("?")[0]}:id`;
  }
  if (!route.includes("/")) return `/${route}`;
  return `${route}`;
};

export default resolveRoutes;

// const resolveRoutes = (route) => {
//   if (route.length <= 3) {
//     let validRoute = route === "/" ? route : "/:id";
//     return validRoute;
//   }
//   return route;
// };
