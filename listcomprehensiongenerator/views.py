from django.shortcuts import render
from django.http import JsonResponse
import openai
import os
import json
from dotenv import load_dotenv
load_dotenv()

# Set your OpenAI API key here
openai.api_key = os.getenv('OPENAI_API_KEY')

def generate_list_comprehension_prompt(input_output_pairs):
    prompt = ""
    for input_list, output_list in input_output_pairs:
        prompt += f"Input list: {input_list}\nOutput list: {output_list}\nList comprehension:\n"
    prompt += " you must use input_list as key word and final list comprehension would be: [relation for i in input_list] and mustn't give any thing apart from list comprehension and you must use input_list variable in "
    return prompt

def generate_common_list_comprehension(input_output_pairs):
    try:
        # Generate the list comprehension prompt for all pairs
        prompt = generate_list_comprehension_prompt(input_output_pairs)

        # Use OpenAI API to generate list comprehension
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=prompt,
            max_tokens=150,  # Adjust the max tokens based on your requirement
            n=1,  # Number of completions to generate
            stop=None  # You can specify a stop sequence if needed
        )
        generated_code = response.choices[0].text.strip()

        return generated_code
    except Exception as e:
        return f'Error generating common list comprehension: {str(e)}'

def list_comprehension_generator(request):
    if request.method == 'POST' and request.headers.get('x-requested-with') == 'XMLHttpRequest':
        input_lists = request.POST.getlist('list1[]')
        output_lists = request.POST.getlist('list2[]')

        input_output_pairs = []
        for list1, list2 in zip(input_lists, output_lists):
            input_list = list(map(int, list1.split(',')))
            output_list = list(map(int, list2.split(',')))

            if len(input_list) != len(output_list):
                return JsonResponse({'error': 'Input and output lists must have the same length.'}, status=400)
            
            input_output_pairs.append((input_list, output_list))

        # Generate common list comprehension for all pairs
        common_comprehension = generate_common_list_comprehension(input_output_pairs)

        print(json.dumps(common_comprehension))
        return JsonResponse({'result': common_comprehension})


    return render(request, 'input_form.html')


# intial template was bew sumlogic for building UI and routes, not to waste the  openapi calls
# from django.shortcuts import render
# from django.http import JsonResponse

# def list_comprehension_generator(request):
#     if request.method == 'POST' and request.headers.get('x-requested-with') == 'XMLHttpRequest':
#         input_lists = request.POST.getlist('list1[]')
#         output_lists = request.POST.getlist('list2[]')

#         results = []

#         for list1, list2 in zip(input_lists, output_lists):
#             input_list = list(map(int, list1.split(',')))
#             output_list = list(map(int, list2.split(',')))

#             if len(input_list) != len(output_list):
#                 return JsonResponse({'error': 'Input and output lists must have the same length.'}, status=400)

#             result = [x + y for x, y in zip(input_list, output_list)]
#             results.append(result)
#             print(results)
        

#         return JsonResponse({'results': 'results'})

#     return render(request, 'input_form.html')
