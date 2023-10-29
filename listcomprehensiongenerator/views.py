from django.shortcuts import render
from django.http import JsonResponse

def list_comprehension_generator(request):
    if request.method == 'POST' and request.headers.get('x-requested-with') == 'XMLHttpRequest':
        input_lists = request.POST.getlist('list1[]')
        output_lists = request.POST.getlist('list2[]')

        results = []

        for list1, list2 in zip(input_lists, output_lists):
            input_list = list(map(int, list1.split(',')))
            output_list = list(map(int, list2.split(',')))

            if len(input_list) != len(output_list):
                return JsonResponse({'error': 'Input and output lists must have the same length.'}, status=400)

            result = [x + y for x, y in zip(input_list, output_list)]
            results.append(result)

        

        return JsonResponse({'results': results})

    return render(request, 'input_form.html')

