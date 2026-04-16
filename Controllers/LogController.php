<?php

namespace Modulos_ERP\LogsKrsft\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class LogController extends Controller
{
    protected string $table = 'logs_krsft';

    public function index(): Response
    {
        // Compatibilidad: algunos frontends resuelven módulos por prefijo "Modules/"
        // y esperan el nombre PascalCase del módulo sin "/Index".
        return Inertia::render('Modules/LogsKrsft');
    }

    public function list(Request $request): JsonResponse
    {
        $query = DB::table($this->table)->orderByDesc('id');

        if ($request->filled('search')) {
            $search = trim((string) $request->input('search'));
            $query->where(function ($q) use ($search) {
                $q->where('action', 'like', "%{$search}%")
                    ->orWhere('message', 'like', "%{$search}%")
                    ->orWhere('level', 'like', "%{$search}%")
                    ->orWhere('user_name', 'like', "%{$search}%");
            });
        }

        return response()->json([
            'success' => true,
            'data' => $query->limit(200)->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'action' => ['required', 'string', 'max:120'],
            'message' => ['required', 'string', 'max:1000'],
            'level' => ['nullable', 'string', 'max:30'],
            'user_name' => ['nullable', 'string', 'max:120'],
        ]);

        $id = DB::table($this->table)->insertGetId([
            'action' => $validated['action'],
            'message' => $validated['message'],
            'level' => $validated['level'] ?? 'info',
            'user_name' => $validated['user_name'] ?? null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Log registrado correctamente',
            'data' => ['id' => $id],
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        DB::table($this->table)->where('id', $id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Log eliminado correctamente',
        ]);
    }
}
