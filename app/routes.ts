import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";

export default [
    index("routes/dashboard.tsx"),
    route("/login", "routes/login.tsx"),
    route("logout", "routes/logout.tsx"),
    route("/requestleave", "routes/requestleave.tsx"),
    route("/myrequests", "routes/myrequests.tsx"),

    ...prefix("/adminactions", [
        index("routes/adminactions.tsx"),
        route("/adduser", "routes/adminactionadduser.tsx"),
        route("/:employeeId", "routes/adminactionrequests.tsx"),
    ]),

    ...prefix("/myteam", [
        index("routes/myteam.tsx"),
        route("/:employeeId", "routes/teamrequests.tsx"),
    ])

] satisfies RouteConfig;
