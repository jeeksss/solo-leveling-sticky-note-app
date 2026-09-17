import { inject, Service } from '@angular/core';
import { Firestore, collection, collectionData, docData } from '@angular/fire/firestore';
import { addDoc, deleteDoc, doc, increment, orderBy, query, setDoc, updateDoc } from 'firebase/firestore';
import { NewTask, Stats, Task as TaskModel } from '../models/task';
import { Observable } from 'rxjs';

@Service()
export class Task {

    private firestore = inject(Firestore);
    private tasksCollection = collection(this.firestore, 'tasks');
    
    addTask(task: NewTask) {
        return addDoc(this.tasksCollection, task);
    }

    getTasks(): Observable<TaskModel[]> {
        const q = query(this.tasksCollection, orderBy('createdAt', 'desc'));
        return collectionData(q, { idField: 'id' }) as Observable<TaskModel[]>;
    }

    deleteTask(id: string) {
        // console.log('SERVICE deleting:', id);
        return deleteDoc(doc(this.firestore, 'tasks', id));
    }

    getTask(id: string): Observable<TaskModel> {
        const ref = doc(this.firestore, 'tasks', id);
        return docData(ref, { idField: 'id' }) as Observable<TaskModel>;
    }

    updateTask(id: string, changes: Partial<NewTask>) {
        // console.log('SERVICE updating', id, changes);
        return updateDoc(doc(this.firestore, 'tasks', id), changes);
    }


// --- BELOW IS FOR NUMBER TRACKING ---

    private statsRef = doc(this.firestore, 'meta', 'stats');

    getStats(): Observable<Stats> {
        return docData(this.statsRef) as Observable<Stats>;
    }

    private colorToStat: Record<string, keyof Omit<Stats, 'completedTotal'>> = {
        pink: 'str',
        blue: 'int',
        green: 'agi',
        yellow: 'vit',
    };

    // async completeTask(id: string, color: string) {
    //     const statKey = this.colorToStat[color] ?? 'vit';
    //     await updateDoc(doc(this.firestore, 'tasks', id), { done: true });
    //     await setDoc(this.statsRef, {
    //         completedTotal: increment(1),
    //         [statKey]: increment(1),
    //     }, { merge: true });
    // }

    async completeTask(id: string, color: string) {
        const statKey = this.colorToStat[color] ?? 'vit';
        try {
            await updateDoc(doc(this.firestore, 'tasks', id), { done: true });
            await setDoc(this.statsRef, {
            completedTotal: increment(1),
            [statKey]: increment(1),
            }, { merge: true });
            console.log('Stats write succeeded');
        } catch (err) {
            console.error('Stats write FAILED:', err);
        }
    }
}
