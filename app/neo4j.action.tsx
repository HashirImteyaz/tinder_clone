"use server";

import {driver } from "@/db";
import { Neo4jUser } from "@/types";
import { Record } from "neo4j-driver";
export const getUserByID=async (id:string)=>{
    const result =await driver.executeQuery(
        'MATCH(u : User { applicationId: $applicationId} )RETURN U',
        {applicationId:id}
    );
    const users=result.records.map((record)=> record.get("u").properties);
    if(users.length==0) return null;
    return users[0] as Neo4jUser ;
};

export const createUser =async(user: Neo4jUser)=>{
    const {applicationId, email,firstname, lastname}=user;
    await driver.executeQuery (
        'CREATE (u:User{applicationId: $applicationId, email: $email, firstname:$firstname, lastname: $lastname})',
        {applicationId, email, firstname, lastname}
    );
};