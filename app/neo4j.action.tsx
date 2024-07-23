"use server";

import {driver } from "@/db";
import { Neo4jUser } from "@/types";
import { Record } from "neo4j-driver";
import { use } from "react";
export const getUserByID=async (id:string)=>{
    const result =await driver.executeQuery(
        'MATCH(u : User { applicationId: $applicationId} )RETURN u',
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

export const getUserWithNoConnection= async(id: String)=> {
    const result = await driver.executeQuery(
        'MATCH (cu: User { applicationId: $applicationId}) MATCH (ou: User) WHERE NOT (cu) - [:LIKE|:DISLIKE]-> (ou) AND cu <> ou RETURN ou'
        , {applicationId: id}
    );
    const users = result.records.map((record) => record.get("ou").properties);
    return users as Neo4jUser[];
};

export const neo4jSwipe=async(id:String,swipe: string,userId: string)=>{
    const type=swipe==='left'? "DISLIKE" : "LIKE";
    await driver.executeQuery(
        'MATCH (cu: User { applicationId: $id}), (ou: User {applicationId:$userId}) CREATE (cu)-[:${type}]-> (ou)',{
            id, userId,
        }
    );

    if(type==='LIKE'){
        const result=await driver.executeQuery(
            'MATCH (cu: User { applicationId: $id}), (ou: User {applicationId:$userId}) WHERE (ou)-[:LIKE]-> (cu) RETURN ou as match',
            {
                id,userId,
            }
        );
    const matches=result.records.map(
        (record)=>record.get("match").properties
    );
    return Boolean(matches.length>0);
    }
};