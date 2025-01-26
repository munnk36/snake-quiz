import { INATURALIST_API, V2_ENDPOINTS } from './constants';
import { SimilarSpeciesResponse } from './typeDefs';

const SIMILAR_SPECIES_FIELDS = '(count:!t,taxon:(ancestor_ids:!t,default_photo:(url:!t),extinct:!t,iconic_taxon_name:!t,id:!t,is_active:!t,name:!t,preferred_common_name:!t,rank:!t,rank_level:!t))';

export async function getSimilarSpecies(speciesTaxonId: number): Promise<SimilarSpeciesResponse> {
    const url = new URL(`${INATURALIST_API.V2}${V2_ENDPOINTS.IDENTIFICATIONS.SIMILAR_SPECIES}`);

    url.search = new URLSearchParams({
        verifiable: 'any',
        taxon_id: speciesTaxonId.toString(),
        fields: SIMILAR_SPECIES_FIELDS,
        per_page: '50',
    }).toString();

    const response = await fetch(url.toString());
    
    if (!response.ok) {
        throw new Error(`Failed to fetch similar species: ${response.statusText}`);
    }

    return response.json();
}
