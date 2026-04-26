<?php

namespace Modulos_ERP\LogsKrsft\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Modulos_ERP\LogsKrsft\Models\LogKrsft;

class LogController extends Controller
{
    protected string $table = 'logs_krsft';

    public function index(): Response
    {
        return Inertia::render('logskrsft/Index');
    }

    public function list(Request $request): JsonResponse
    {
        $query = LogKrsft::query()->orderByDesc('id');
        $selectedModule = (string) $request->input('module', 'all');
        $selectedLevel = (string) $request->input('level', 'all');

        if ($request->filled('search')) {
            $search = trim((string) $request->input('search'));
            $query->where(function ($q) use ($search) {
                $q->where('action', 'like', "%{$search}%")
                    ->orWhere('message', 'like', "%{$search}%")
                    ->orWhere('level', 'like', "%{$search}%")
                    ->orWhere('user_name', 'like', "%{$search}%");
            });
        }

        if ($selectedModule !== 'all') {
            $query->where('module', $selectedModule);
        }

        if ($selectedLevel !== 'all') {
            $query->where('level', $selectedLevel);
        }

        return response()->json([
            'success' => true,
            'data' => $query->limit(500)->get(),
        ]);
    }

    public function modules(): JsonResponse
    {
        $marketplaceModules = DB::table('erp_modules')
            ->where('is_installed', true)
            ->where('enabled', true)
            ->whereNotNull('local_path')
            ->pluck('local_path')
            ->map(static fn ($path) => basename((string) $path))
            ->filter()
            ->values();

        $modules = collect(['auth'])
            ->merge($marketplaceModules)
            ->unique()
            ->values();

        return response()->json([
            'success' => true,
            'data' => $modules,
        ]);
    }

    public function stats(): JsonResponse
    {
        $levels = LogKrsft::query()
            ->select('level', DB::raw('count(*) as count'))
            ->groupBy('level')
            ->get()
            ->pluck('count', 'level');

        $stats = [
            'total' => LogKrsft::count(),
            'info' => (int) ($levels['info'] ?? 0),
            'warning' => (int) ($levels['warning'] ?? 0),
            'error' => (int) ($levels['error'] ?? 0),
            'levels' => $levels,
            'modules' => LogKrsft::query()
                ->select('module', DB::raw('count(*) as count'))
                ->whereNotNull('module')
                ->groupBy('module')
                ->get()
                ->pluck('count', 'module'),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'action' => ['required', 'string', 'max:120'],
            'message' => ['required', 'string', 'max:1000'],
            'level' => ['nullable', 'string', 'max:30'],
            'user_name' => ['nullable', 'string', 'max:120'],
            'module' => ['nullable', 'string', 'max:120'],
        ]);

        $id = DB::table($this->table)->insertGetId([
            'action' => $validated['action'],
            'message' => $validated['message'],
            'level' => $validated['level'] ?? 'info',
            'user_name' => $validated['user_name'] ?? null,
            'module' => $validated['module'] ?? 'logskrsft',
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
