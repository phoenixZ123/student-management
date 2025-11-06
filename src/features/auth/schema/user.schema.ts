export const userSchema={
     login: {
        schema: {
            tags: ["Auth"],
            body: {
                type: "object",
                required: ["email", "password"],
                properties: {
                    email: { type: "string" },
                    password: { type: "string" }
                }
            },
            response: {
                200: {
                    type: "object",
                    properties: {
                        status: { type: "boolean" },
                        message: { type: "string" },
                        data: {
                            type: "object",
                            properties: {
                                id: { type: "integer" },
                                uuid: { type: "string" },
                                email: { type: "string" },                                                        
                                password: { type: "string" },
                                 is_active:{type:"boolean"},
                                session: { type: "string" },
                            }
                        },
                        token: {
                            type: "object",
                            properties: {
                                access: { type: "string" },
                                refresh: { type: "string" }
                            }
                        }
                    }
                },
                400: {
                    type: "object",
                    properties: {
                        status: { type: "boolean" },
                        message: { type: "string" },
                    }
                }
            }
        }
    },
}