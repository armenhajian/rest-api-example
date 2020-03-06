import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import Post from "./Post";

@Entity()
export default class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @OneToMany(type => Post, post => post.user, {
        cascade: true
    })
    posts: Post[];

}
