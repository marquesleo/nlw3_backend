import {getRepository} from 'typeorm';
import Orphanages from '../models/Orphanages'
import { Request,Response } from 'express';
import orphanages_view from '../views/orphanages_view';
import * as Yup from 'yup';

export default {

    async index(request: Request,response:Response){
        const orphanagesRepository = getRepository(Orphanages);
        const orphanages = await orphanagesRepository.find(
            {
                relations: ['images']
            }
        );
        return response.json(orphanages_view.renderMany(orphanages));
    },

    async show(request: Request,response:Response){
        const {id} = request.params;    


        const orphanagesRepository = getRepository(Orphanages);
        const orphanage = await orphanagesRepository.findOneOrFail(id, {
            relations : ['images']
        });
        
        return response.json(orphanages_view.render(orphanage));
    },
   
    async create(request:Request,response:Response ) {
        const {
            name,
            latitude,
            longitude,
            about,
            instruction,
            opening_hours,
            open_on_weekends,
         } = request.body;
         console.log(request.body);
         
         const orphanagesRepository = getRepository(Orphanages);

         const requestImages = request.files as Express.Multer.File[];

         

         const images = requestImages.map(image => {
             return {path: image.filename}
         })


         const data = {
            name,
            latitude,
            longitude,
            about,
            instruction,
            opening_hours,
            open_on_weekends: open_on_weekends ==='true',
            images
         }

         const schema = Yup.object().shape({
             name: Yup.string().required(),
             latitude: Yup.number().required(),
             longitude: Yup.number().required(),
             about: Yup.string().required().max(300),
             instruction: Yup.string().required(),
             opening_hours: Yup.string().required(),
             open_on_weekends:Yup.boolean().required(),
             images: Yup.array(Yup.object().shape({
                 path:Yup.string().required()
             })) 
         });
 
         await schema.validate(data,
         {
            //retorna os erros todos juntos ao inves de somente um
            abortEarly:false,
         });
         const orphanage = orphanagesRepository.create(data);
         await orphanagesRepository.save(orphanage);
      
         return response.status(201).json(orphanage);
    }
}