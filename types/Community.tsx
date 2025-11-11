/* Modeled after lab 5, defines a community type and a default */

export interface Community {
    communityID: number, 
    communityName: string, 
    description: string, 
    location: string,
}

export const defaultCommunity: Community = {
    communityID: 0,
    communityName: "RVD",
    description: "A dorm",
    location: "Calvin University",
};
