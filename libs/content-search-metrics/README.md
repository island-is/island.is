```python
"""
Content Search Metrics

This module provides metrics for evaluating search queries, focusing on
metrics such as ranking accuracy and precision. You can customize and
alter test cases by manipulating ranked test data in the RankedDataService.
"""

class ContentSearchMetrics:
    """
    A class to evaluate and report search query metrics. The metrics
    include precision, accuracy, and ranking evaluation among others.
    """

    def __init__(self, ranked_data_service):
        """
        Initialize the ContentSearchMetrics instance.

        Args:
            ranked_data_service (RankedDataService): The service providing
                ranked test data.
        """
        self.ranked_data_service = ranked_data_service

    def calculate_precision(self, relevant_items, retrieved_items):
        """
        Calculate the precision of search queries.

        Precision is defined as the number of relevant items retrieved
        divided by the total number of items retrieved.

        Args:
            relevant_items (list): A list of relevant item identifiers.
            retrieved_items (list): A list of retrieved item identifiers.

        Returns:
            float: The precision metric as a float between 0 and 1.
        """
        if not retrieved_items:
            return 0.0

        relevant_retrieved = [item for item in retrieved_items if item in relevant_items]
        precision = len(relevant_retrieved) / len(retrieved_items)
        return precision

    def calculate_ranking_accuracy(self, ranked_list, expected_list):
        """
        Calculate the ranking accuracy of the search results.

        Ranking accuracy is determined by comparing the order of items
        in the ranked list to the expected order.

        Args:
            ranked_list (list): A list of item identifiers ranked by the search engine.
            expected_list (list): A list of expected item identifiers in the desired order.

        Returns:
            float: The ranking accuracy as a percentage between 0 and 100.
        """
        if not ranked_list or not expected_list:
            return 0.0

        matched_rankings = sum([1 for idx, item in enumerate(ranked_list) if item in expected_list[:idx + 1]])
        accuracy = (matched_rankings / len(expected_list)) * 100
        return accuracy

    def evaluate_query(self, query_id):
        """
        Evaluate a specific query by its identifier.

        This method fetches the ranked results for the given query and
        computes the precision and ranking accuracy.

        Args:
            query_id (str): The unique identifier for the query to be evaluated.

        Returns:
            dict: A dictionary containing the precision and ranking accuracy.
        """
        ranked_results, expected_results = self.ranked_data_service.get_query_results(query_id)

        precision = self.calculate_precision(expected_results, ranked_results)
        ranking_accuracy = self.calculate_ranking_accuracy(ranked_results, expected_results)

        return {
            'precision': precision,
            'ranking_accuracy': ranking_accuracy
        }

    def run_evaluation(self):
        """
        Run evaluation for all test cases available in the RankedDataService.

        This method iterates through all test queries and computes metrics
        for each of them, returning the results as a summary.

        Returns:
            list: A list of dictionaries, each containing metrics for a particular query.
        """
        all_query_ids = self.ranked_data_service.get_all_query_ids()
        evaluation_results = []

        for query_id in all_query_ids:
            result = self.evaluate_query(query_id)
            evaluation_results.append({
                'query_id': query_id,
                'metrics': result
            })

        return evaluation_results
```