import { TrainingPath, TrainingPathModel } from './../schemas/TrainingPath';
import { Kata, KataModel } from './../schemas/Kata';

export class TrainingPathService {

    createNewTrainingPath(topic: string, name: string, description: string) {
        return new Promise((resolve, reject) => {
            let newTrainingPath = new TrainingPathModel({
                topic: topic, 
                name: name, 
                description: description
            });
            newTrainingPath.save((err) => {
                if(err) { 
                    console.log(err); 
                    reject(err); 
                } else {
                    resolve(newTrainingPath);
                }
            });
        });
    }

    /**
     * Endpoint to retrieve all the training paths (without katas)
     * Path: /api/training-paths
     */
    getTrainingPathsWithoutKatas(): Promise<Array<TrainingPath>> {
        return new Promise((resolve, reject) => {
            TrainingPathModel.find(
                    { enabled: true }, 
                    'topic name description'
                ).exec((err, tPaths) => {
                    if(err) { console.log(err); return reject(err); }
                    return resolve(tPaths);
                }
            );
        });
    }

    /**
     * Endpoint to retrieve all the training paths to populate the grid (settings)
     * Path: /api/training-paths/grid
     */
    getTrainingPathsForGrid(): Promise<Array<TrainingPath>> {
        return new Promise((resolve, reject) => {
            TrainingPathModel
                .find('topic name description enabled createdAt updatedAt')
                .lean()
                .exec((err, tPaths: Array<any>) => {
                    if(err) { console.log(err); return reject(err); }
                    return resolve(tPaths.map((x:any) => { x.katas = x.katas.length; return x; }));
                }
            );
        });
    }

    /**
     * Endpoint to retrieve a training path by its topic
     * Path: /api/training-paths/topic/:topic
     */
    getTrainingPathByTopic(topic: string): Promise<Kata> {
        return new Promise((resolve, reject) => {
            TrainingPathModel.findOne(
                { topic: topic, enabled: true }, 
                'topic name description updatedAt'
            ).exec((err, metadata) => {
                if(err) { console.log(err); return reject(err); }
                return resolve(metadata);
            });
        });
    }

    /**
     * Endpoint to retrieve the katas of a training path specified by its topic
     * Path: /api/training-paths/:topic/katas
     */
    getKatasOfTrainingPathByTopic(topic: string): Promise<Array<Kata>> {
        return new Promise((resolve, reject) => {
            TrainingPathModel.findOne(
                { topic: topic, enabled: true }, 
                //'topic name description updatedAt katas'
            ).exec((err, tPaths) => {
                if(err) { console.log(err); return reject(err); }
                KataModel.populate(tPaths, { path: 'katas', select: { 'rawkata': 0 } }, (err, tPaths) => {
                    if(err) { console.log(err); return reject(err); }
                    return resolve(tPaths);
                });
            });
        });
    }

    getKatasByTrainingPathId(pathId: string): Promise<Array<Kata>> {
        return new Promise((resolve, reject) => {
            TrainingPathModel.find({ _id: pathId, enabled: true }, 'katas').exec((err, exercises) => {
                if(err) { console.log(err); return reject(err); }
                KataModel.populate(exercises, { path: 'katas' }, (err, tPaths) => {
                    if(err) { console.log(err); return reject(err); }
                    return resolve(exercises);
                });
            });
        });
    }

}