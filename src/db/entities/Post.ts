import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import User from "./User";

@Entity()
export default class Post extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    body: string;

    @Column()
    metadata: string;

    @ManyToOne(type => User, user => user.posts)
    user: User;
}
