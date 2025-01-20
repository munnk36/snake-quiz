import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getQuizObservations } from './observations';
import { Observation, QuizData, QuizGuessOption } from './typeDefs';
import { useEffect, useState } from 'react';
import { getSimilarSpecies } from './similar';

export default function useQuizObservations(
    numberOfObservations: number = 10,
    quizId?: string,
    placeId?: string,
): UseQueryResult<QuizData, Error> {
    return useQuery({
        queryKey: ['quiz', quizId || 'random'],
        queryFn: () => getQuizObservations(numberOfObservations, quizId, placeId),
        staleTime: Infinity,
        refetchOnWindowFocus: false
    });
};

export function useQuizMultipleChoiceOptions(observedSnake?: Observation, numberOfOptions: number = 4) {
    const [quizOptions, setQuizOptions] = useState<QuizGuessOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function generateOptions() {
            if (!observedSnake?.taxon?.min_species_taxon_id) return;
            setIsLoading(true);
            try {
                const similarSpecies = await getSimilarSpecies(observedSnake.taxon.min_species_taxon_id);
                
                const correctOption: QuizGuessOption = {
                    taxonId: observedSnake.taxon.min_species_taxon_id,
                    scientificName: observedSnake.taxon.name,
                    preferredCommonName: observedSnake.taxon.preferred_common_name || observedSnake.taxon.name,
                    isCorrect: true
                };

                const otherOptions = similarSpecies.results
                    .filter(result => 
                        result.taxon.is_active &&
                        !result.taxon.extinct &&
                        result.taxon.preferred_common_name &&
                        result.taxon.id !== observedSnake.taxon.min_species_taxon_id
                    )
                    .sort(() => Math.random() - 0.5)
                    .slice(0, numberOfOptions - 1)
                    .map(result => ({
                        taxonId: result.taxon.id,
                        scientificName: result.taxon.name,
                        preferredCommonName: result.taxon.preferred_common_name!,
                        isCorrect: false
                    }));

                const allOptions = [...otherOptions, correctOption]
                    .sort(() => Math.random() - 0.5);

                setQuizOptions(allOptions);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to generate quiz options'));
            } finally {
                setIsLoading(false);
            }
        }

        if (observedSnake?.taxon?.min_species_taxon_id) {
            generateOptions();
        }
    }, [observedSnake, numberOfOptions]);

    return { quizOptions, isLoading, error };
}
